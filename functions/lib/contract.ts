/**
 * Canonical "Lawn Service Authorization & Terms Agreement" content.
 *
 * Single source of truth shared by:
 *  - the React contract form (components/promo/PromoCampaign.tsx)
 *  - the generated PDF (functions/lib/pdf.ts)
 *  - the agreement endpoint (functions/api/promo/agreement.ts)
 *
 * This module intentionally contains plain constants only (no runtime
 * dependencies) so it is safe to import from both the Next.js client bundle
 * and the Cloudflare Pages Functions bundle.
 */

export const TITLE = 'Lawn Service Authorization & Terms Agreement';
export const SERVICE_PROVIDER = 'Evergrow Landscaping';
export const AUTHORIZE_SENTENCE =
    'By signing below, I authorize Evergrow Landscaping ("Service Provider") to contact me regarding lawn maintenance services at the address listed above.';

export const TERMS: string[] = [
    'This form authorizes the Service Provider to discuss, schedule, and provide lawn maintenance services for my property.',
    'Service details, including pricing, schedule, frequency, and any additional services, may be discussed and finalized after an on-site assessment or consultation.',
    'I understand that lawn service may include mowing, trimming, edging, blowing, and other agreed-upon maintenance tasks.',
    'I agree to provide reasonable access to the property and ensure that pets, toys, hoses, and other obstacles are removed before service.',
    'I understand that weather conditions, equipment issues, or other unforeseen circumstances may require service dates to be adjusted.',
    'I acknowledge that hidden obstacles, unmarked sprinkler heads, invisible fences, underground utilities, or other concealed hazards may present risks and should be disclosed to the Service Provider.',
    'I understand that this authorization does not guarantee a specific service date, price, or contract term until confirmed by both parties.',
    'I consent to receiving phone calls, text messages, and emails regarding scheduling, estimates, invoices, and service updates.',
    'Either party may decline or discontinue service before a final service agreement is executed.',
];

export const CHECKBOX_LABEL =
    'I have read and agree to the Lawn Service Authorization & Terms Agreement.';

export const TERMS_VERSION = 'v1';
