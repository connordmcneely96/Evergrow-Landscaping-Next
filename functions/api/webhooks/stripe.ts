import { Env } from '../../types';
import Stripe from 'stripe';
import { sendEmail, getPaymentReceiptEmail } from '../../lib/email';

interface InvoiceRow {
    id: number;
    project_id: number;
    customer_id: number;
    amount: number;
    invoice_type: string;
    service_type: string | null;
}

interface CustomerRow {
    email: string;
    name: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        // Get the raw body for signature verification
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return new Response(JSON.stringify({ error: 'No signature provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Initialize Stripe
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-12-18.acacia',
        });

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return new Response(JSON.stringify({ error: 'Invalid signature' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // Get invoice ID from metadata
                const invoiceId = session.metadata?.invoice_id;
                if (!invoiceId) {
                    console.error('No invoice_id in session metadata');
                    break;
                }

                // Get payment intent ID
                const paymentIntentId = session.payment_intent as string;

                // Get invoice details
                const invoice = await env.DB.prepare(`
                    SELECT
                        i.id,
                        i.project_id,
                        i.customer_id,
                        i.amount,
                        i.invoice_type,
                        p.service_type
                    FROM invoices i
                    JOIN projects p ON i.project_id = p.id
                    WHERE i.id = ?
                `).bind(invoiceId).first<InvoiceRow>();

                if (!invoice) {
                    console.error('Invoice not found:', invoiceId);
                    break;
                }

                // Update invoice status
                await env.DB.prepare(`
                    UPDATE invoices
                    SET status = 'paid',
                        stripe_payment_intent_id = ?,
                        paid_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind(paymentIntentId, invoiceId).run();

                // Update project payment status
                if (invoice.invoice_type === 'deposit') {
                    await env.DB.prepare(`
                        UPDATE projects
                        SET deposit_paid = 1
                        WHERE id = ?
                    `).bind(invoice.project_id).run();
                } else if (invoice.invoice_type === 'balance') {
                    await env.DB.prepare(`
                        UPDATE projects
                        SET balance_paid = 1
                        WHERE id = ?
                    `).bind(invoice.project_id).run();
                }

                // Get customer details for email
                const customer = await env.DB.prepare(`
                    SELECT email, name
                    FROM customers
                    WHERE id = ?
                `).bind(invoice.customer_id).first<CustomerRow>();

                if (customer) {
                    // Send receipt email using existing function
                    try {
                        await sendEmail(env, {
                            to: customer.email,
                            subject: `Payment Receipt - Invoice #${invoice.id}`,
                            html: getPaymentReceiptEmail({
                                name: customer.name,
                                amount: invoice.amount,
                                invoiceType: invoice.invoice_type,
                                projectId: invoice.project_id,
                                paidAt: new Date(),
                            }),
                        });
                    } catch (emailError) {
                        console.error('Failed to send receipt email:', emailError);
                        // Don't fail the webhook if email fails
                    }
                }

                console.log('Payment processed successfully for invoice:', invoiceId);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
                break;
            }

            default:
                console.log('Unhandled event type:', event.type);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({
            error: 'Webhook processing failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
