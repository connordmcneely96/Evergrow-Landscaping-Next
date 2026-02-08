import Stripe from 'stripe';
import { Env } from '../types';

const DEFAULT_STRIPE_RETRY_COUNT = 2;
const DEFAULT_STRIPE_RETRY_DELAY_MS = 500;
const RETRYABLE_STRIPE_ERROR_TYPES = new Set([
    'api_error',
    'api_connection_error',
    'rate_limit_error',
]);

type StripeRetryOptions = {
    retries?: number;
    baseDelayMs?: number;
};

type StripeErrorLike = {
    type?: string;
    message?: string;
};

function isRetryableStripeError(error: unknown): error is StripeErrorLike {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const stripeError = error as StripeErrorLike;
    return typeof stripeError.type === 'string' && RETRYABLE_STRIPE_ERROR_TYPES.has(stripeError.type);
}

async function sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createPaymentIntentWithRetry(
    env: Env,
    params: Stripe.PaymentIntentCreateParams,
    options: StripeRetryOptions = {}
): Promise<Stripe.PaymentIntent> {
    const stripe = getStripeClient(env);
    const retries = options.retries ?? DEFAULT_STRIPE_RETRY_COUNT;
    const baseDelayMs = options.baseDelayMs ?? DEFAULT_STRIPE_RETRY_DELAY_MS;
    let attempt = 0;

    while (true) {
        try {
            return await stripe.paymentIntents.create(params);
        } catch (error) {
            if (!isRetryableStripeError(error) || attempt >= retries) {
                throw error;
            }

            const delay = baseDelayMs * 2 ** attempt;
            attempt += 1;
            await sleep(delay);
        }
    }
}

/**
 * Get configured Stripe client instance
 * @param env - Worker environment with STRIPE_SECRET_KEY
 * @returns Stripe client
 */
export function getStripeClient(env: Env): Stripe {
    if (!env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY not configured');
    }

    return new Stripe(env.STRIPE_SECRET_KEY, {
        typescript: true,
    });
}

/**
 * Create a payment intent for processing payments
 * @param env - Worker environment
 * @param amount - Amount in cents (e.g., 5000 = $50.00)
 * @param customerId - Optional Stripe customer ID
 * @param metadata - Optional metadata to attach
 * @returns Payment intent
 */
export async function createPaymentIntent(
    env: Env,
    amount: number,
    customerId?: string,
    metadata?: Record<string, string>,
    options?: { setupFutureUsage?: Stripe.PaymentIntentCreateParams['setup_future_usage'] }
): Promise<Stripe.PaymentIntent> {
    return createPaymentIntentWithRetry(env, {
        amount,
        currency: 'usd',
        customer: customerId,
        metadata: {
            source: 'evergrow-landscaping-website',
            ...metadata,
        },
        setup_future_usage: options?.setupFutureUsage,
        automatic_payment_methods: {
            enabled: true,
        },
    });
}

type DepositPaymentIntentInput = {
    amountInCents: number;
    stripeCustomerId: string;
    projectId: number;
    customerId: number;
    savePaymentMethod?: boolean;
    retries?: number;
};

export async function createDepositPaymentIntent(
    env: Env,
    input: DepositPaymentIntentInput
): Promise<Stripe.PaymentIntent> {
    return createPaymentIntentWithRetry(
        env,
        {
            amount: input.amountInCents,
            currency: 'usd',
            customer: input.stripeCustomerId,
            metadata: {
                source: 'evergrow-landscaping-website',
                project_id: String(input.projectId),
                customer_id: String(input.customerId),
                invoice_type: 'deposit',
            },
            setup_future_usage: input.savePaymentMethod ? 'off_session' : undefined,
            automatic_payment_methods: {
                enabled: true,
            },
        },
        { retries: input.retries }
    );
}

/**
 * Create a Stripe customer
 * @param env - Worker environment
 * @param email - Customer email
 * @param name - Customer name
 * @param phone - Optional phone number
 * @param address - Optional address details
 * @returns Stripe customer
 */
export async function createCustomer(
    env: Env,
    email: string,
    name: string,
    phone?: string,
    address?: Stripe.AddressParam
): Promise<Stripe.Customer> {
    const stripe = getStripeClient(env);

    return stripe.customers.create({
        email,
        name,
        phone,
        address,
        metadata: {
            source: 'evergrow-landscaping-website',
        },
    });
}

/**
 * Retrieve a Stripe customer by ID
 * @param env - Worker environment
 * @param customerId - Stripe customer ID
 * @returns Stripe customer
 */
export async function getCustomer(
    env: Env,
    customerId: string
): Promise<Stripe.Customer> {
    const stripe = getStripeClient(env);
    return stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
}

/**
 * Create an invoice for a customer
 * @param env - Worker environment
 * @param customerId - Stripe customer ID
 * @param items - Line items for the invoice
 * @param dueDate - Optional due date (timestamp)
 * @returns Stripe invoice
 */
export async function createInvoice(
    env: Env,
    customerId: string,
    items: Array<{ description: string; amount: number; quantity?: number }>,
    dueDate?: number
): Promise<Stripe.Invoice> {
    const stripe = getStripeClient(env);

    // Create invoice items
    for (const item of items) {
        await stripe.invoiceItems.create({
            customer: customerId,
            description: item.description,
            amount: item.amount,
            quantity: item.quantity || 1,
        });
    }

    // Create and send invoice
    const invoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: 'send_invoice',
        days_until_due: dueDate ? Math.ceil((dueDate - Date.now()) / (1000 * 60 * 60 * 24)) : 30,
        metadata: {
            source: 'evergrow-landscaping-website',
        },
    });

    // Send the invoice
    await stripe.invoices.sendInvoice(invoice.id);

    return invoice;
}

/**
 * Verify Stripe webhook signature
 * @param env - Worker environment with STRIPE_WEBHOOK_SECRET
 * @param payload - Request body as string
 * @param signature - Stripe signature from header
 * @returns Stripe event
 */
export async function verifyWebhookSignature(
    env: Env,
    payload: string,
    signature: string
): Promise<Stripe.Event> {
    const stripe = getStripeClient(env);

    if (!env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    // Note: constructEvent is synchronous, but we mark async for compatibility
    // In Cloudflare Workers verify logic, we might need specific crypto handling if not using Node
    // But standard stripe package should work with Node compat turned on (which Pages likely has or shims)
    // Or we use web-compatible verification if needed.
    // Assuming Node compat for now as 'stripe' package is Node-first.
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET
    );
}

/**
 * Create a deposit payment intent (50% of total)
 * @param env - Worker environment
 * @param totalAmount - Total project amount in cents
 * @param customerId - Stripe customer ID
 * @param projectId - Project ID for metadata
 * @returns Payment intent for deposit
 */
export async function createDepositPayment(
    env: Env,
    totalAmount: number,
    customerId: string,
    projectId: number
): Promise<Stripe.PaymentIntent> {
    const depositAmount = Math.round(totalAmount * 0.5);

    return createPaymentIntent(env, depositAmount, customerId, {
        project_id: projectId.toString(),
        payment_type: 'deposit',
        total_amount: totalAmount.toString(),
        deposit_amount: depositAmount.toString(),
    });
}

/**
 * Create a balance payment intent (remaining 50%)
 * @param env - Worker environment
 * @param totalAmount - Total project amount in cents
 * @param customerId - Stripe customer ID
 * @param projectId - Project ID for metadata
 * @returns Payment intent for balance
 */
export async function createBalancePayment(
    env: Env,
    totalAmount: number,
    customerId: string,
    projectId: number
): Promise<Stripe.PaymentIntent> {
    const balanceAmount = Math.round(totalAmount * 0.5);

    return createPaymentIntent(env, balanceAmount, customerId, {
        project_id: projectId.toString(),
        payment_type: 'balance',
        total_amount: totalAmount.toString(),
        balance_amount: balanceAmount.toString(),
    });
}

/**
 * Refund a payment
 * @param env - Worker environment
 * @param paymentIntentId - Payment intent ID to refund
 * @param amount - Optional partial refund amount in cents
 * @param reason - Refund reason
 * @returns Stripe refund
 */
export async function refundPayment(
    env: Env,
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
    const stripe = getStripeClient(env);

    return stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason,
    });
}
