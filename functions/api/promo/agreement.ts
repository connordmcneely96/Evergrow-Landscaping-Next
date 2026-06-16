import { Env } from '../../types';
import { rateLimitMiddleware } from '../../lib/cache';
import {
    getAgreementAdminEmail,
    getAgreementCustomerEmail,
    sendEmail,
} from '../../lib/email';
import { validatePromoAgreementPayload } from '../../lib/validation';
import { generateAgreementPdf } from '../../lib/pdf';
import { SERVICE_PROVIDER, TERMS_VERSION } from '../../lib/contract';

const AGREEMENT_LIMIT = 5;
const AGREEMENT_WINDOW_SECONDS = 60 * 60;
const ADMIN_EMAIL_FALLBACK = 'Karson@evergrowlandscaping.com';
const PDF_FILENAME = 'Evergrow-Lawn-Service-Agreement.pdf';
const SUCCESS_MESSAGE =
    "You're all set! A copy of your signed agreement has been emailed to you. Evergrow will be in contact within 72 hours.";
const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

/** Encode bytes as base64 for Resend's attachment `content` field. */
function uint8ToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
            ...bytes.subarray(i, i + chunkSize)
        );
    }
    return btoa(binary);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const rateLimitResponse = await rateLimitMiddleware(
            request,
            env,
            AGREEMENT_LIMIT,
            AGREEMENT_WINDOW_SECONDS
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

        // Honeypot: silently drop bot submissions.
        const honeypot = (body as Record<string, unknown> | null)?.website;
        if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
            return new Response(JSON.stringify({
                success: true,
                message: SUCCESS_MESSAGE,
            }), { headers: JSON_HEADERS });
        }

        const validation = validatePromoAgreementPayload(body);
        if (!validation.success || !validation.data) {
            return new Response(JSON.stringify({
                success: false,
                error: validation.errors[0] || 'Invalid request',
            }), { status: 400, headers: JSON_HEADERS });
        }

        const {
            customerName,
            serviceAddress,
            phone,
            email,
            printedName,
            signedDate,
            signatureDataUrl,
            promoLeadId,
        } = validation.data;

        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const timestamp = new Date().toISOString();

        // Generate the signed PDF.
        const pdfBytes = await generateAgreementPdf({
            customerName,
            serviceAddress,
            phone,
            email,
            printedName,
            signedDate,
            signatureDataUrl,
            ip,
            timestamp,
        });

        // Store privately in R2.
        const pdfKey = `agreements/${crypto.randomUUID()}.pdf`;
        await env.R2_BUCKET.put(pdfKey, pdfBytes, {
            httpMetadata: { contentType: 'application/pdf' },
        });

        // Persist the agreement.
        const insertResult = await env.DB.prepare(
            `
        INSERT INTO service_agreements (
          promo_lead_id, customer_name, service_address, phone, email,
          service_provider, agreed_to_terms, printed_name, signed_date,
          terms_version, pdf_r2_key, ip_address, user_agent, status
        ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 'signed')
      `
        )
            .bind(
                promoLeadId ?? null,
                customerName,
                serviceAddress,
                phone,
                email,
                SERVICE_PROVIDER,
                printedName,
                signedDate,
                TERMS_VERSION,
                pdfKey,
                ip,
                userAgent
            )
            .run();

        if (!insertResult.success) {
            throw new Error('Failed to save service agreement');
        }

        // Email both parties with the PDF attached. Email failures are logged
        // but do not fail the request — the agreement is already stored.
        const pdfBase64 = uint8ToBase64(pdfBytes);
        const attachments = [{ filename: PDF_FILENAME, content: pdfBase64 }];

        const customerEmailResult = await sendEmail(env, {
            to: email,
            subject: 'Your Signed Lawn Service Authorization — Evergrow Landscaping',
            html: getAgreementCustomerEmail({ customerName }),
            attachments,
        });
        if (!customerEmailResult.success) {
            console.error(
                'Agreement customer email failed:',
                customerEmailResult.error
            );
        }

        const adminEmail = env.NOTIFICATION_EMAIL || ADMIN_EMAIL_FALLBACK;
        const adminEmailResult = await sendEmail(env, {
            to: adminEmail,
            subject: 'New Signed Service Agreement — Lawn Maintenance',
            html: getAgreementAdminEmail({
                customerName,
                serviceAddress,
                phone,
                email,
                signedDate,
            }),
            replyTo: email,
            attachments,
        });
        if (!adminEmailResult.success) {
            console.error(
                'Agreement admin email failed:',
                adminEmailResult.error
            );
        }

        return new Response(JSON.stringify({
            success: true,
            message: SUCCESS_MESSAGE,
        }), { status: 201, headers: JSON_HEADERS });

    } catch (error) {
        console.error('Promo agreement error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to submit. Please try again.',
        }), { status: 500, headers: JSON_HEADERS });
    }
};
