import { Env } from '../../types';
import { rateLimitMiddleware } from '../../lib/cache';
import { getPromoLeadAdminEmail, sendEmail } from '../../lib/email';
import { validatePromoLeadPayload } from '../../lib/validation';

const LEAD_LIMIT = 5;
const LEAD_WINDOW_SECONDS = 60 * 60;
const LEAD_SOURCE = 'promo-lawn-maintenance';
const ADMIN_EMAIL_FALLBACK = 'Karson@evergrowlandscaping.com';
const SUCCESS_MESSAGE = 'Thanks! Evergrow will be in contact with you within 72 hours.';
const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const rateLimitResponse = await rateLimitMiddleware(
            request,
            env,
            LEAD_LIMIT,
            LEAD_WINDOW_SECONDS
        );

        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid JSON body',
            }), { status: 400, headers: JSON_HEADERS });
        }

        // Honeypot: if a bot fills the hidden `website` field, silently drop
        // the submission (return success without storing anything).
        const honeypot = (body as Record<string, unknown> | null)?.website;
        if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
            return new Response(JSON.stringify({
                success: true,
                message: SUCCESS_MESSAGE,
            }), { headers: JSON_HEADERS });
        }

        const validation = validatePromoLeadPayload(body);
        if (!validation.success || !validation.data) {
            return new Response(JSON.stringify({
                success: false,
                error: validation.errors[0] || 'Invalid request',
            }), { status: 400, headers: JSON_HEADERS });
        }

        const { email, phone } = validation.data;

        const insertResult = await env.DB.prepare(
            `
        INSERT INTO promo_leads (email, phone, source, status)
        VALUES (?, ?, ?, 'new')
      `
        )
            .bind(email, phone, LEAD_SOURCE)
            .run();

        if (!insertResult.success) {
            throw new Error('Failed to save promo lead');
        }

        // Notify the team. A failed notification should not fail the request —
        // the lead is already captured, and forcing a retry would create
        // duplicate rows.
        const adminEmail = env.NOTIFICATION_EMAIL || ADMIN_EMAIL_FALLBACK;
        const emailResult = await sendEmail(env, {
            to: adminEmail,
            subject: 'New Promo Lead — Lawn Maintenance Offer',
            html: getPromoLeadAdminEmail({ email, phone, source: LEAD_SOURCE }),
            replyTo: email,
        });

        if (!emailResult.success) {
            console.error('Promo lead admin notification failed:', emailResult.error);
        }

        const promoLeadId = insertResult.meta?.last_row_id ?? null;

        return new Response(JSON.stringify({
            success: true,
            message: SUCCESS_MESSAGE,
            promoLeadId,
        }), { status: 201, headers: JSON_HEADERS });

    } catch (error) {
        console.error('Promo lead error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to submit. Please try again.',
        }), { status: 500, headers: JSON_HEADERS });
    }
};
