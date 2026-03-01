import { Env } from '../../types';
import { getStripeClient } from '../../lib/stripe';

type ConfirmSessionRequest = {
    sessionId?: unknown;
};

interface InvoiceRow {
    id: number;
    project_id: number;
    customer_id: number;
    amount: number;
    invoice_type: string;
    status: string;
}

function parseSessionId(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json<ConfirmSessionRequest>();
        const sessionId = parseSessionId(body.sessionId);

        if (!sessionId) {
            return new Response(JSON.stringify({ success: false, error: 'sessionId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const stripe = getStripeClient(env);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return new Response(JSON.stringify({ success: false, error: 'Session is not paid yet' }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null;

        const invoiceIdFromMetadata = session.metadata?.invoice_id || null;

        const invoice = await env.DB.prepare(`
            SELECT
                id,
                project_id,
                customer_id,
                amount,
                invoice_type,
                status
            FROM invoices
            WHERE (id = ?)
               OR (stripe_invoice_id = ?)
            LIMIT 1
        `).bind(invoiceIdFromMetadata, session.id).first<InvoiceRow>();

        if (!invoice) {
            return new Response(JSON.stringify({ success: false, error: 'Invoice not found for this session' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (invoice.status !== 'paid') {
            await env.DB.prepare(`
                UPDATE invoices
                SET status = 'paid',
                    paid_at = CURRENT_TIMESTAMP,
                    stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id)
                WHERE id = ?
            `).bind(paymentIntentId, invoice.id).run();

            if (invoice.invoice_type === 'deposit') {
                await env.DB.prepare('UPDATE projects SET deposit_paid = 1 WHERE id = ?')
                    .bind(invoice.project_id)
                    .run();
            } else if (invoice.invoice_type === 'balance') {
                await env.DB.prepare('UPDATE projects SET balance_paid = 1 WHERE id = ?')
                    .bind(invoice.project_id)
                    .run();
            } else if (invoice.invoice_type === 'full') {
                await env.DB.prepare('UPDATE projects SET deposit_paid = 1, balance_paid = 1 WHERE id = ?')
                    .bind(invoice.project_id)
                    .run();
            }
        }

        return new Response(JSON.stringify({
            success: true,
            invoiceId: invoice.id,
            projectId: invoice.project_id,
            invoiceType: invoice.invoice_type,
            paid: true,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Confirm checkout session error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to confirm payment session',
            details: error instanceof Error ? error.message : 'Unknown error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
