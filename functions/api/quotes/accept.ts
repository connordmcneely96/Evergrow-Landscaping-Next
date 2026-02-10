import { Env } from '../../types';

const QUOTE_TOKEN_PREFIX = 'quote_token:';

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
    let mainNotes: string[] = [];
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
        // Parse token to get quote ID
        const tokenMatch = token.match(/^[a-f0-9]{32,}$/i);
        if (!tokenMatch) {
            return new Response(
                JSON.stringify({ success: false, error: 'Invalid token format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Find which quote this token belongs to by checking KV
        // We need to iterate through potential quote IDs
        // This is inefficient but necessary without a reverse lookup
        // In production, consider storing token->quoteId mapping separately

        let quoteId: number | null = null;
        let storedToken: string | null = null;

        // Try to find the quote by checking recent quote IDs
        // This is a workaround - ideally we'd store a reverse mapping
        for (let i = 1; i <= 1000; i++) {
            const key = `${QUOTE_TOKEN_PREFIX}${i}`;
            const value = await env.CACHE.get(key);
            if (value === token) {
                quoteId = i;
                storedToken = value;
                break;
            }
        }

        if (!quoteId || !storedToken) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid or expired token',
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

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
                JSON.stringify({
                    success: false,
                    error: 'Quote not found or no longer available',
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if quote is expired
        const validUntil = new Date(quote.quote_valid_until);
        if (validUntil < new Date()) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'This quote has expired',
                }),
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
            JSON.stringify({
                success: false,
                error: 'Failed to load quote details',
            }),
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
        // Find quote ID from token
        let quoteId: number | null = null;

        for (let i = 1; i <= 1000; i++) {
            const key = `${QUOTE_TOKEN_PREFIX}${i}`;
            const value = await env.CACHE.get(key);
            if (value === token) {
                quoteId = i;
                break;
            }
        }

        if (!quoteId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid or expired token',
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Update quote status to accepted
        const updateResult = await env.DB.prepare(
            `
            UPDATE quotes
            SET
                status = 'accepted',
                accepted_at = datetime('now')
            WHERE id = ? AND status = 'quoted'
            `
        )
            .bind(quoteId)
            .run();

        if (!updateResult.success || (updateResult.meta?.changes ?? 0) === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Quote cannot be accepted (may have been already accepted or expired)',
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Delete the token from cache
        await env.CACHE.delete(`${QUOTE_TOKEN_PREFIX}${quoteId}`);

        console.info('Quote accepted:', { quoteId });

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Quote accepted successfully',
                quoteId,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Quote acceptance error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to accept quote',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
