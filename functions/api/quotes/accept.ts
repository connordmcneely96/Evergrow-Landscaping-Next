import { getDepositInvoiceEmail, sendEmail } from '../../lib/email';
import { Env } from '../../types';

const QUOTE_TOKEN_PREFIX = 'quote_token:';
const QUOTE_TOKEN_REVERSE_PREFIX = 'quote_token_reverse:';

interface QuoteRow {
    id: number;
    customer_id: number | null;
    contact_name: string | null;
    contact_email: string | null;
    customer_name: string | null;
    customer_email: string | null;
    service_type: string;
    description: string | null;
    quoted_amount: number;
    quote_notes: string | null;
    quote_valid_until: string;
    status: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
    'lawn-care': 'Lawn Care & Maintenance',
    'flower-beds': 'Flower Bed Installation',
    'seasonal-cleanup': 'Seasonal Cleanup',
    'pressure-washing': 'Pressure Washing',
    other: 'Other Services',
};

function getServiceTypeLabel(serviceType: string): string {
    const normalized = serviceType.trim().toLowerCase();
    return SERVICE_TYPE_LABELS[normalized] || serviceType;
}

function parseQuoteNotes(notes: string | null): {
    notes: string | null;
    timeline: string | null;
    terms: string | null;
} {
    if (!notes) {
        return { notes: null, timeline: null, terms: null };
    }

    const lines = notes.split('\n');
    const mainNotes: string[] = [];
    let timeline: string | null = null;
    let terms: string | null = null;

    for (const line of lines) {
        if (line.startsWith('Timeline: ')) {
            timeline = line.substring('Timeline: '.length);
        } else if (line.startsWith('Terms: ')) {
            terms = line.substring('Terms: '.length);
        } else {
            mainNotes.push(line);
        }
    }

    return {
        notes: mainNotes.length > 0 ? mainNotes.join('\n').trim() || null : null,
        timeline,
        terms,
    };
}

// GET - Load quote details for preview
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response(
            JSON.stringify({ success: false, error: 'Token is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const tokenMatch = token.match(/^[a-f0-9]{32,}$/i);
        if (!tokenMatch) {
            return new Response(
                JSON.stringify({ success: false, error: 'Invalid token format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // O(1) reverse lookup: token → quoteId
        const quoteIdStr = await env.CACHE.get(`${QUOTE_TOKEN_REVERSE_PREFIX}${token}`);
        if (!quoteIdStr) {
            return new Response(
                JSON.stringify({ success: false, error: 'Invalid or expired token' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const quoteId = parseInt(quoteIdStr, 10);

        // Fetch quote details
        const quote = await env.DB.prepare(
            `
            SELECT
                q.id,
                q.customer_id,
                q.service_type,
                q.description,
                q.quoted_amount,
                q.quote_notes,
                q.quote_valid_until,
                q.status,
                q.contact_name,
                q.contact_email,
                c.name as customer_name,
                c.email as customer_email
            FROM quotes q
            LEFT JOIN customers c ON q.customer_id = c.id
            WHERE q.id = ? AND q.status = 'quoted'
            LIMIT 1
            `
        )
            .bind(quoteId)
            .first<QuoteRow>();

        if (!quote) {
            return new Response(
                JSON.stringify({ success: false, error: 'Quote not found or no longer available' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if quote is expired
        const validUntil = new Date(quote.quote_valid_until);
        if (validUntil < new Date()) {
            return new Response(
                JSON.stringify({ success: false, error: 'This quote has expired' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const parsedNotes = parseQuoteNotes(quote.quote_notes);
        const customerName = quote.contact_name || quote.customer_name || 'Customer';

        return new Response(
            JSON.stringify({
                success: true,
                quote: {
                    id: quote.id,
                    customerName,
                    serviceType: getServiceTypeLabel(quote.service_type),
                    description: quote.description,
                    quotedAmount: quote.quoted_amount,
                    notes: parsedNotes.notes,
                    timeline: parsedNotes.timeline,
                    terms: parsedNotes.terms,
                    validUntil: quote.quote_valid_until,
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Quote preview error:', error);
        return new Response(
            JSON.stringify({ success: false, error: 'Failed to load quote details' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// POST - Accept the quote
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    let body: any;
    try {
        body = await request.json();
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: 'Invalid request body' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { token } = body;

    if (!token || typeof token !== 'string') {
        return new Response(
            JSON.stringify({ success: false, error: 'Token is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // O(1) reverse lookup: token → quoteId
        const quoteIdStr = await env.CACHE.get(`${QUOTE_TOKEN_REVERSE_PREFIX}${token}`);
        if (!quoteIdStr) {
            return new Response(
                JSON.stringify({ success: false, error: 'Invalid or expired token' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const quoteId = parseInt(quoteIdStr, 10);

        // Fetch quote details (required for creating project/invoice)
        const quote = await env.DB.prepare(
            `
            SELECT
                q.id,
                q.customer_id,
                q.service_type,
                q.description,
                q.quoted_amount,
                q.quote_notes,
                c.name as customer_name,
                c.email as customer_email,
                q.contact_name,
                q.contact_email,
                q.status
            FROM quotes q
            LEFT JOIN customers c ON q.customer_id = c.id
            WHERE q.id = ?
            `
        )
            .bind(quoteId)
            .first<QuoteRow>();

        if (!quote) {
            return new Response(
                JSON.stringify({ success: false, error: 'Quote not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (quote.status === 'accepted') {
            // Check if project already exists to ensure idempotency
            const existingProject = await env.DB.prepare('SELECT id FROM projects WHERE quote_id = ?')
                .bind(quoteId)
                .first() as { id: number } | null;

            if (existingProject) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: 'Quote already accepted',
                        quoteId,
                        projectId: existingProject.id,
                        invoiceId: null,
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Status is accepted but project missing — retry creation
            console.log(`Quote ${quoteId} is accepted but missing project. Retrying creation...`);
        } else if (quote.status !== 'quoted') {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Quote cannot be accepted. Current status: ${quote.status}`,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Resolve customer_id: use linked customer or look up by email
        let resolvedCustomerId = quote.customer_id;
        if (!resolvedCustomerId && (quote.contact_email || quote.customer_email)) {
            const email = quote.contact_email || quote.customer_email;
            const found = await env.DB.prepare(
                'SELECT id FROM customers WHERE email = ? LIMIT 1'
            ).bind(email).first<{ id: number }>();
            resolvedCustomerId = found?.id ?? null;
        }

        // 1. Update quote status to accepted
        await env.DB.prepare(
            `
            UPDATE quotes
            SET
                status = 'accepted',
                accepted_at = datetime('now')
            WHERE id = ?
            `
        )
            .bind(quoteId)
            .run();

        // Backfill customer_id on the quote if we just resolved it
        if (resolvedCustomerId && !quote.customer_id) {
            await env.DB.prepare('UPDATE quotes SET customer_id = ? WHERE id = ?')
                .bind(resolvedCustomerId, quoteId).run();
        }

        // 2. Create Project
        const depositAmount = quote.quoted_amount * 0.5;

        const projectResult = await env.DB.prepare(
            `
            INSERT INTO projects (
                customer_id, quote_id, service_type, description,
                total_amount, deposit_amount, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'scheduled', datetime('now'))
            `
        )
            .bind(
                resolvedCustomerId,
                quote.id,
                quote.service_type,
                quote.description,
                quote.quoted_amount,
                depositAmount
            )
            .run();

        const projectId = projectResult.meta.last_row_id;

        // 3. Create Deposit Invoice (status='pending' so payment endpoint can process it)
        const invoiceResult = await env.DB.prepare(
            `
            INSERT INTO invoices (
                project_id, customer_id, amount, invoice_type,
                description, status, due_date, sent_at, created_at
            ) VALUES (?, ?, ?, 'deposit', ?, 'pending', date('now', '+3 days'), datetime('now'), datetime('now'))
            `
        )
            .bind(
                projectId,
                resolvedCustomerId,
                depositAmount,
                `Deposit for ${getServiceTypeLabel(quote.service_type)}`
            )
            .run();

        const invoiceId = invoiceResult.meta.last_row_id;

        // 4. Send Deposit Invoice Email
        const invoiceUrl = `https://evergrowlandscaping.com/portal/invoices/${invoiceId}/pay`;
        const customerEmail = quote.contact_email || quote.customer_email;
        const customerName = quote.contact_name || quote.customer_name || 'Customer';

        if (customerEmail && env.RESEND_API_KEY) {
            const emailHtml = getDepositInvoiceEmail({
                customerName: customerName,
                projectName: getServiceTypeLabel(quote.service_type),
                depositAmount: depositAmount,
                totalAmount: quote.quoted_amount,
                invoiceUrl: invoiceUrl,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            });

            // Send in background (don't await)
            context.waitUntil(
                sendEmail(env, {
                    to: customerEmail,
                    subject: `Invoice: Deposit for ${getServiceTypeLabel(quote.service_type)}`,
                    html: emailHtml,
                })
            );
        }

        // Delete both forward and reverse token entries from cache
        await env.CACHE.delete(`${QUOTE_TOKEN_PREFIX}${quoteId}`);
        await env.CACHE.delete(`${QUOTE_TOKEN_REVERSE_PREFIX}${token}`);

        console.info('Quote accepted, project and invoice created:', { quoteId, projectId, invoiceId });

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Quote accepted successfully. Project and invoice created.',
                quoteId,
                projectId,
                invoiceId,
                paymentUrl: `/portal/invoices/${invoiceId}/pay`,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Quote acceptance error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to accept quote',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
