import { getQuoteEmail, sendEmail } from '../../../lib/email';
import { requireAdmin } from '../../../lib/session';
import { Env } from '../../../types';

const QUOTE_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
const QUOTE_TOKEN_PREFIX = 'quote_token:';
const ACCEPT_QUOTE_URL = 'https://evergrowlandscaping.com/portal/quotes/accept';
const TERMS_URL = 'https://evergrowlandscaping.com/terms';

const SERVICE_TYPE_LABELS: Record<string, string> = {
    'lawn-care': 'Lawn Care & Maintenance',
    'flower-beds': 'Flower Bed Installation',
    'seasonal-cleanup': 'Seasonal Cleanup',
    'pressure-washing': 'Pressure Washing',
    other: 'Other Services',
};

const DEPOSIT_REQUIRED_SERVICES = new Set(['flower-beds', 'pressure-washing']);

interface QuoteRow {
    id: number;
    status: string;
    service_type: string;
    description: string | null;
    quote_notes: string | null;
    contact_name: string | null;
    contact_email: string | null;
    customer_name: string | null;
    customer_email: string | null;
}

function parseQuoteId(value?: string | string[]): number | null {
    const val = Array.isArray(value) ? value[0] : value;
    if (!val || !/^\d+$/.test(val)) {
        return null;
    }
    const parsed = Number.parseInt(val, 10);
    return parsed > 0 ? parsed : null;
}

function parseQuotedAmount(value: unknown): number | null {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return null;
    }
    const rounded = Math.round(value * 100) / 100;
    if (rounded < 50 || rounded > 10000) {
        return null;
    }
    return rounded;
}

function parseOptionalText(
    value: unknown,
    fieldName: string
): { value: string | null; error?: string } {
    if (value === undefined || value === null) {
        return { value: null };
    }
    if (typeof value !== 'string') {
        return { value: null, error: `${fieldName} must be a string` };
    }
    const trimmed = value.trim();
    return { value: trimmed.length > 0 ? trimmed : null };
}

function getQuoteStatusError(status: string): string {
    switch (status) {
        case 'quoted':
            return 'Quote has already been sent';
        case 'accepted':
            return 'Quote has already been accepted';
        case 'declined':
            return 'Quote has already been declined';
        case 'expired':
            return 'Quote has expired';
        default:
            return 'Quote cannot be updated';
    }
}

function getServiceTypeLabel(serviceType: string): string {
    const normalized = serviceType.trim().toLowerCase();
    return SERVICE_TYPE_LABELS[normalized] || formatTitle(normalized);
}

function formatTitle(value: string): string {
    return value
        .replace(/[_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildStoredNotes(
    notes: string | null,
    timeline: string | null,
    terms: string | null
): string | null {
    const sections: string[] = [];
    if (notes) {
        sections.push(notes);
    }
    if (timeline) {
        sections.push(`Timeline: ${timeline}`);
    }
    if (terms) {
        sections.push(`Terms: ${terms}`);
    }
    return sections.length > 0 ? sections.join('\n') : null;
}

function normalizeEmail(value?: string | null): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeName(value?: string | null): string {
    if (!value) {
        return 'Customer';
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : 'Customer';
}

function formatDateDisplay(value: Date): string {
    return value.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function generateToken(): string {
    const cryptoApi = globalThis.crypto;
    if (cryptoApi?.randomUUID) {
        return cryptoApi.randomUUID().replace(/-/g, '');
    }
    const bytes = new Uint8Array(32);
    if (cryptoApi?.getRandomValues) {
        cryptoApi.getRandomValues(bytes);
    } else {
        for (let i = 0; i < bytes.length; i += 1) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { request, env, params } = context;

    console.log('[Send Quote] Request received:', {
        url: request.url,
        params,
        paramId: params.id,
    });

    const authResult = await requireAdmin(request, env);
    if (authResult instanceof Response) {
        console.log('[Send Quote] Auth failed');
        return authResult;
    }

    const quoteId = parseQuoteId(params.id);
    console.log('[Send Quote] Parsed quote ID:', quoteId);

    if (!quoteId) {
        console.error('[Send Quote] Invalid quote ID from params:', params.id);
        return new Response(JSON.stringify({ success: false, error: 'Invalid quote ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let body: unknown;
    try {
        body = await request.json();
        console.log('[Send Quote] Request body:', body);
    } catch (error) {
        console.error('[Send Quote] Body parse error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!body || typeof body !== 'object') {
        console.error('[Send Quote] Invalid body type:', typeof body);
        return new Response(JSON.stringify({ success: false, error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { quotedAmount, notes, timeline, terms } = body as Record<string, unknown>;
    console.log('[Send Quote] Parsed fields:', { quotedAmount, hasNotes: !!notes, hasTimeline: !!timeline, hasTerms: !!terms });

    const amountValue = parseQuotedAmount(quotedAmount);
    if (amountValue === null) {
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Invalid quoted amount (must be between $50 and $10,000)',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const notesResult = parseOptionalText(notes, 'notes');
    if (notesResult.error) {
        return new Response(JSON.stringify({ success: false, error: notesResult.error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const timelineResult = parseOptionalText(timeline, 'timeline');
    if (timelineResult.error) {
        return new Response(JSON.stringify({ success: false, error: timelineResult.error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const termsResult = parseOptionalText(terms, 'terms');
    if (termsResult.error) {
        return new Response(JSON.stringify({ success: false, error: termsResult.error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        console.log('[Send Quote] Querying database for quote:', quoteId);
        const quote = await env.DB.prepare(
            `
        SELECT
          q.id,
          q.status,
          q.service_type,
          q.description,
          q.quote_notes,
          q.contact_name,
          q.contact_email,
          c.name as customer_name,
          c.email as customer_email
        FROM quotes q
        LEFT JOIN customers c ON q.customer_id = c.id
        WHERE q.id = ?
        LIMIT 1
      `
        )
            .bind(quoteId)
            .first<QuoteRow>();

        console.log('[Send Quote] Quote found:', {
            id: quote?.id,
            status: quote?.status,
            hasContactEmail: !!quote?.contact_email,
            hasCustomerEmail: !!quote?.customer_email
        });

        if (!quote) {
            console.error('[Send Quote] Quote not found in database:', quoteId);
            return new Response(JSON.stringify({ success: false, error: 'Quote not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Allow resending quotes that are in 'quoted' status in case email failed
        if (quote.status !== 'pending' && quote.status !== 'quoted') {
            console.error('[Send Quote] Quote not in valid status for sending:', {
                quoteId,
                status: quote.status
            });
            return new Response(
                JSON.stringify({
                    success: false,
                    error: getQuoteStatusError(quote.status),
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const acceptanceToken = generateToken();
        const tokenKey = `${QUOTE_TOKEN_PREFIX}${quoteId}`;

        try {
            await env.CACHE.put(tokenKey, acceptanceToken, {
                expirationTtl: QUOTE_TOKEN_TTL_SECONDS,
            });
        } catch (error) {
            console.error('Quote token storage failed:', error);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Failed to create quote acceptance link',
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const storedNotes = buildStoredNotes(
            notesResult.value,
            timelineResult.value,
            termsResult.value
        );

        const updateResult = await env.DB.prepare(
            `
        UPDATE quotes
        SET
          quoted_amount = ?,
          status = 'quoted',
          quoted_at = COALESCE(quoted_at, datetime('now')),
          quote_notes = COALESCE(?, quote_notes),
          quote_valid_until = datetime('now', '+30 day')
        WHERE id = ? AND (status = 'pending' OR status = 'quoted')
      `
        )
            .bind(amountValue, storedNotes, quoteId)
            .run();

        const updateChanges = updateResult.meta?.changes ?? 0;
        if (!updateResult.success || updateChanges === 0) {
            await env.CACHE.delete(tokenKey);
            if (updateChanges === 0) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: 'Quote has already been updated',
                    }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
            throw new Error('Failed to update quote');
        }

        const acceptanceUrl = `${ACCEPT_QUOTE_URL}?token=${encodeURIComponent(acceptanceToken)}`;

        const customerEmail = normalizeEmail(quote.contact_email || quote.customer_email);
        const customerName = normalizeName(quote.contact_name || quote.customer_name);
        const serviceTypeLabel = getServiceTypeLabel(quote.service_type);
        const validUntilDisplay = formatDateDisplay(
            new Date(Date.now() + QUOTE_TOKEN_TTL_SECONDS * 1000)
        );

        // Validate that customer has an email address
        if (!customerEmail) {
            console.error('[Send Quote] Cannot send quote without customer email:', quoteId);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Cannot send quote: Customer email address is required',
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('[Send Quote] Proceeding with email send to:', customerEmail);

        let emailSent = false;
        if (customerEmail) {
            const emailHtml = getQuoteEmail({
                customerName,
                serviceType: serviceTypeLabel,
                description: quote.description,
                quotedAmount: amountValue,
                notes: notesResult.value,
                timeline: timelineResult.value,
                terms: termsResult.value,
                acceptanceUrl,
                validUntilDisplay,
                requiresDeposit: DEPOSIT_REQUIRED_SERVICES.has(quote.service_type),
                termsUrl: TERMS_URL,
            });

            const emailResult = await sendEmail(env, {
                to: customerEmail,
                subject: 'Your Landscaping Quote from Evergrow',
                html: emailHtml,
            });

            if (!emailResult.success) {
                console.error('Quote email send failed:', emailResult.error);
            } else {
                emailSent = true;
            }

            if (env.NOTIFICATION_EMAIL) {
                const ownerResult = await sendEmail(env, {
                    to: env.NOTIFICATION_EMAIL,
                    subject: `Copy: Quote sent to ${customerName}`,
                    html: emailHtml,
                });

                if (!ownerResult.success) {
                    console.error('Quote owner copy failed:', ownerResult.error);
                }
            }
        } else {
            console.warn('Quote email missing customer email:', quoteId);
        }

        console.info('Quote sent to customer', {
            quoteId,
            customerEmail,
            adminId: authResult.userId,
        });

        const quotedAtIso = new Date().toISOString();

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Quote sent to customer',
                quote: {
                    id: quoteId,
                    quotedAmount: Number(amountValue.toFixed(2)),
                    status: 'quoted',
                    quotedAt: quotedAtIso,
                    customerEmail,
                },
                emailSent,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Admin quote update error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to update quote',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
