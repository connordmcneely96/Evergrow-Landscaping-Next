import type Stripe from 'stripe';
import { Env } from '../../types';
import { verifyWebhookSignature } from '../../lib/stripe';
import {
    getPaymentFailureAlertEmail,
    getPaymentFailureEmail,
    getPaymentReceiptEmail,
    getRefundConfirmationEmail,
    sendEmail,
} from '../../lib/email';

const OWNER_EMAIL_FALLBACK = 'contact@evergreenlandscaping.com';
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 7;
const DB_RETRY_ATTEMPTS = 3;
const DB_RETRY_BASE_DELAY_MS = 200;

type InvoiceLookup = {
    id: number;
    project_id: number;
    customer_id: number;
    invoice_type: string;
    amount: number;
    status: string;
    customer_email: string | null;
    customer_name: string | null;
};

type CustomerLookup = {
    email: string;
    name: string | null;
};

async function sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDbUpdateWithRetry(
    env: Env,
    query: string,
    params: unknown[],
    label: string
): Promise<void> {
    let attempt = 0;
    while (attempt < DB_RETRY_ATTEMPTS) {
        try {
            const result = await env.DB.prepare(query).bind(...params).run();
            if (!result.success) {
                throw new Error(`D1 update failed for ${label}`);
            }
            return;
        } catch (error) {
            attempt += 1;
            if (attempt >= DB_RETRY_ATTEMPTS) {
                throw error;
            }
            const delay = DB_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
            await sleep(delay);
        }
    }
}

async function attemptDbUpdate(
    env: Env,
    query: string,
    params: unknown[],
    label: string
): Promise<boolean> {
    try {
        await runDbUpdateWithRetry(env, query, params, label);
        return true;
    } catch (error) {
        console.error('Stripe webhook database update failed:', { label, error });
        return false;
    }
}

function getMetadataValue(metadata: Stripe.Metadata, key: string): string | null {
    const value = metadata[key];
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function parsePositiveInt(value: string | null): number | null {
    if (!value) {
        return null;
    }
    if (!/^\d+$/.test(value)) {
        return null;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeInvoiceType(value: string | null): string | null {
    if (!value) {
        return null;
    }
    const normalized = value.trim().toLowerCase();
    return normalized.length > 0 ? normalized : null;
}

function getChargeEmail(charge: Stripe.Charge): string | null {
    return charge.billing_details?.email ?? charge.receipt_email ?? null;
}

function getPaymentIntentEmail(paymentIntent: Stripe.PaymentIntent): string | null {
    if (paymentIntent.receipt_email) {
        return paymentIntent.receipt_email;
    }
    const latestCharge = paymentIntent.latest_charge;
    if (latestCharge && typeof latestCharge !== 'string') {
        return getChargeEmail(latestCharge);
    }
    return null;
}

async function fetchInvoiceByPaymentIntent(
    env: Env,
    paymentIntentId: string
): Promise<InvoiceLookup | null> {
    const result = await env.DB.prepare(
        `
      SELECT
        i.id,
        i.project_id,
        i.customer_id,
        i.invoice_type,
        i.amount,
        i.status,
        c.email as customer_email,
        c.name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.stripe_payment_intent_id = ?
      LIMIT 1
    `
    )
        .bind(paymentIntentId)
        .first<InvoiceLookup>();

    return result ?? null;
}

async function fetchCustomerById(
    env: Env,
    customerId: number
): Promise<CustomerLookup | null> {
    const result = await env.DB.prepare(
        `
      SELECT email, name
      FROM customers
      WHERE id = ?
      LIMIT 1
    `
    )
        .bind(customerId)
        .first<CustomerLookup>();

    return result ?? null;
}

async function resolveCustomerInfo(
    env: Env,
    invoice: InvoiceLookup | null,
    fallback: { email: string | null; name: string | null; customerId: number | null }
): Promise<{ email: string | null; name: string | null }> {
    if (invoice?.customer_email || invoice?.customer_name) {
        return {
            email: invoice.customer_email ?? null,
            name: invoice.customer_name ?? null,
        };
    }

    if (fallback.customerId) {
        const customer = await fetchCustomerById(env, fallback.customerId);
        if (customer?.email) {
            return {
                email: customer.email,
                name: customer.name ?? null,
            };
        }
    }

    return {
        email: fallback.email ?? null,
        name: fallback.name ?? null,
    };
}

async function sendPaymentReceiptEmailHandler(
    env: Env,
    data: {
        email: string | null;
        name: string | null;
        amount: number;
        invoiceType: string | null;
        projectId: number | null;
        paidAt: Date;
    }
): Promise<void> {
    if (!data.email) {
        return;
    }

    const emailHtml = getPaymentReceiptEmail({
        name: data.name ?? undefined,
        amount: data.amount,
        invoiceType: data.invoiceType ?? undefined,
        projectId: data.projectId ?? undefined,
        paidAt: data.paidAt,
    });

    const result = await sendEmail(env, {
        to: data.email,
        subject: 'Payment receipt',
        html: emailHtml,
    });

    if (!result.success) {
        console.error('Stripe webhook receipt email failed:', result.error);
    }
}

async function sendPaymentFailureEmailToCustomer(
    env: Env,
    data: {
        email: string | null;
        name: string | null;
        amount: number;
        reason: string | null;
        retryUrl: string | null;
    }
): Promise<void> {
    if (!data.email) {
        return;
    }

    const emailHtml = getPaymentFailureEmail({
        name: data.name ?? undefined,
        amount: data.amount,
        reason: data.reason ?? undefined,
        retryUrl: data.retryUrl ?? undefined,
    });

    const result = await sendEmail(env, {
        to: data.email,
        subject: 'Payment failed - action required',
        html: emailHtml,
    });

    if (!result.success) {
        console.error('Stripe webhook payment failure email failed:', result.error);
    }
}

async function sendPaymentFailureAlertToOwner(
    env: Env,
    ownerEmail: string,
    data: {
        customerName: string;
        customerEmail: string | null;
        amount: number;
        projectId: number | null;
        paymentIntentId: string;
        reason: string | null;
    }
): Promise<void> {
    const emailHtml = getPaymentFailureAlertEmail({
        customerName: data.customerName,
        customerEmail: data.customerEmail ?? undefined,
        amount: data.amount,
        projectId: data.projectId ?? undefined,
        paymentIntentId: data.paymentIntentId,
        reason: data.reason ?? undefined,
    });

    const result = await sendEmail(env, {
        to: ownerEmail,
        subject: 'Payment failed - customer follow-up needed',
        html: emailHtml,
    });

    if (!result.success) {
        console.error('Stripe webhook owner alert email failed:', result.error);
    }
}

async function sendRefundConfirmationEmailHandler(
    env: Env,
    data: {
        email: string | null;
        name: string | null;
        amount: number;
        reason: string | null;
    }
): Promise<void> {
    if (!data.email) {
        return;
    }

    const emailHtml = getRefundConfirmationEmail({
        name: data.name ?? undefined,
        amount: data.amount,
        reason: data.reason ?? undefined,
    });

    const result = await sendEmail(env, {
        to: data.email,
        subject: 'Refund confirmation',
        html: emailHtml,
    });

    if (!result.success) {
        console.error('Stripe webhook refund email failed:', result.error);
    }
}

async function handlePaymentIntentSucceeded(
    env: Env,
    event: Stripe.Event
): Promise<boolean> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata ?? {};
    const invoice = await fetchInvoiceByPaymentIntent(env, paymentIntent.id);
    const invoiceType = normalizeInvoiceType(
        invoice?.invoice_type ??
        getMetadataValue(metadata, 'invoice_type') ??
        getMetadataValue(metadata, 'payment_type')
    );
    const projectId =
        invoice?.project_id ?? parsePositiveInt(getMetadataValue(metadata, 'project_id'));

    if (!invoice) {
        console.error('Stripe webhook invoice missing for payment intent:', paymentIntent.id);
    }

    const invoiceUpdated = await attemptDbUpdate(
        env,
        `
      UPDATE invoices
      SET status = 'paid',
          paid_at = datetime('now')
      WHERE stripe_payment_intent_id = ?
    `,
        [paymentIntent.id],
        'Update invoice status'
    );

    let depositUpdated = true;
    if (invoiceType === 'deposit') {
        if (!projectId) {
            console.error(
                'Stripe webhook missing project_id for deposit payment intent:',
                paymentIntent.id
            );
            depositUpdated = false;
        } else {
            depositUpdated = await attemptDbUpdate(
                env,
                `
          UPDATE projects
          SET deposit_paid = 1
          WHERE id = ?
        `,
                [projectId],
                'Update project deposit status'
            );
        }
    }

    const customerInfo = await resolveCustomerInfo(env, invoice, {
        email: getPaymentIntentEmail(paymentIntent),
        name: paymentIntent.shipping?.name ?? null,
        customerId: parsePositiveInt(getMetadataValue(metadata, 'customer_id')),
    });

    await sendPaymentReceiptEmailHandler(env, {
        email: customerInfo.email,
        name: customerInfo.name,
        amount: Number.isFinite(paymentIntent.amount)
            ? paymentIntent.amount / 100
            : invoice?.amount ?? 0,
        invoiceType: invoiceType ?? invoice?.invoice_type ?? null,
        projectId: projectId ?? invoice?.project_id ?? null,
        paidAt: paymentIntent.created ? new Date(paymentIntent.created * 1000) : new Date(),
    });

    return Boolean(invoice) && invoiceUpdated && depositUpdated;
}

async function handlePaymentIntentFailed(env: Env, event: Stripe.Event): Promise<boolean> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata ?? {};
    const invoice = await fetchInvoiceByPaymentIntent(env, paymentIntent.id);
    const projectId =
        invoice?.project_id ?? parsePositiveInt(getMetadataValue(metadata, 'project_id'));
    const invoiceId = invoice?.id ?? null;

    const customerInfo = await resolveCustomerInfo(env, invoice, {
        email: getPaymentIntentEmail(paymentIntent),
        name: paymentIntent.shipping?.name ?? null,
        customerId: parsePositiveInt(getMetadataValue(metadata, 'customer_id')),
    });

    await sendPaymentFailureEmailToCustomer(env, {
        email: customerInfo.email,
        name: customerInfo.name,
        amount: Number.isFinite(paymentIntent.amount)
            ? paymentIntent.amount / 100
            : invoice?.amount ?? 0,
        reason: paymentIntent.last_payment_error?.message ?? null,
        retryUrl: invoiceId ? `/portal/invoices/${invoiceId}/pay` : null,
    });

    const ownerEmail = env.NOTIFICATION_EMAIL || OWNER_EMAIL_FALLBACK;
    await sendPaymentFailureAlertToOwner(env, ownerEmail, {
        customerName: customerInfo.name ?? 'Customer',
        customerEmail: customerInfo.email,
        amount: Number.isFinite(paymentIntent.amount)
            ? paymentIntent.amount / 100
            : invoice?.amount ?? 0,
        projectId,
        paymentIntentId: paymentIntent.id,
        reason: paymentIntent.last_payment_error?.message ?? null,
    });

    return true;
}

async function handleChargeRefunded(env: Env, event: Stripe.Event): Promise<boolean> {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId =
        typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;

    if (!paymentIntentId) {
        console.error('Stripe webhook refund missing payment intent ID:', charge.id);
        return false;
    }

    const invoice = await fetchInvoiceByPaymentIntent(env, paymentIntentId);
    if (!invoice) {
        console.error('Stripe webhook invoice missing for refund:', paymentIntentId);
    }

    const refundUpdated = await attemptDbUpdate(
        env,
        `
      UPDATE invoices
      SET status = 'refunded'
      WHERE stripe_payment_intent_id = ?
    `,
        [paymentIntentId],
        'Update invoice refund status'
    );

    const customerInfo = await resolveCustomerInfo(env, invoice, {
        email: getChargeEmail(charge),
        name: charge.billing_details?.name ?? null,
        customerId: null,
    });

    await sendRefundConfirmationEmailHandler(env, {
        email: customerInfo.email,
        name: customerInfo.name,
        amount: Number.isFinite(charge.amount_refunded) ? charge.amount_refunded / 100 : 0,
        reason: getMetadataValue(charge.metadata ?? {}, 'refund_reason'),
    });

    return Boolean(invoice) && refundUpdated;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const signature = request.headers.get('stripe-signature');
    const rawBody = await request.text();

    let event: Stripe.Event;
    try {
        event = await verifyWebhookSignature(env, rawBody, signature ?? '');
    } catch (error) {
        console.error('Stripe webhook signature verification failed:', error);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const eventId = event.id;
    const eventType = event.type;
    const cacheKey = `stripe_event:${eventId}`;

    try {
        const alreadyProcessed = await env.CACHE.get(cacheKey);
        if (alreadyProcessed) {
            return new Response(
                JSON.stringify({ received: true, duplicate: true, eventType }),
                { headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('Stripe webhook idempotency check failed:', error);
    }

    let processed = false;
    try {
        switch (eventType) {
            case 'payment_intent.succeeded':
                processed = await handlePaymentIntentSucceeded(env, event);
                break;
            case 'payment_intent.payment_failed':
                processed = await handlePaymentIntentFailed(env, event);
                break;
            case 'charge.refunded':
                processed = await handleChargeRefunded(env, event);
                break;
            default:
                console.log('Unhandled Stripe event type:', eventType);
                processed = true;
        }
    } catch (error) {
        console.error('Stripe webhook processing error:', { eventType, eventId, error });
    }

    if (processed) {
        try {
            await env.CACHE.put(cacheKey, 'processed', {
                expirationTtl: EVENT_TTL_SECONDS,
            });
        } catch (error) {
            console.error('Stripe webhook idempotency write failed:', error);
        }
    }

    return new Response(JSON.stringify({ received: true, eventType, processed }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
