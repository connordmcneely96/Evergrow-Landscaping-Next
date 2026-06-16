export interface NewsletterSubscribeInput {
    email: string;
    name?: string;
    source?: string;
}

export const newsletterSubscribeSchema = {
    email: { required: true, format: 'email' },
    name: { required: false, maxLength: 100 },
    source: { required: false, maxLength: 100 },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export interface PromoLeadInput {
    email: string;
    phone: string;
}

export function validatePromoLeadPayload(
    payload: unknown
): { success: boolean; errors: string[]; data?: PromoLeadInput } {
    if (!payload || typeof payload !== 'object') {
        return {
            success: false,
            errors: ['Request body must be a JSON object'],
        };
    }

    const { email, phone } = payload as Record<string, unknown>;
    const errors: string[] = [];

    const emailValue = typeof email === 'string' ? email.trim() : '';
    if (emailValue.length === 0) {
        errors.push('Email is required');
    } else if (!emailRegex.test(emailValue)) {
        errors.push('Invalid email format');
    }

    const phoneValue = typeof phone === 'string' ? phone.trim() : '';
    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneValue.length === 0) {
        errors.push('Phone is required');
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.push('Please enter a valid phone number');
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        errors: [],
        data: {
            email: normalizeEmail(emailValue),
            phone: phoneDigits,
        },
    };
}

export interface PromoAgreementInput {
    customerName: string;
    serviceAddress: string;
    phone: string;
    email: string;
    printedName: string;
    signedDate: string;
    signatureDataUrl: string;
    promoLeadId?: number;
}

// ~2MB cap on the data-URL string to guard against oversized payloads.
const MAX_SIGNATURE_LENGTH = 2 * 1024 * 1024;
const SIGNATURE_PREFIX = 'data:image/png;base64,';

export function validatePromoAgreementPayload(
    payload: unknown
): { success: boolean; errors: string[]; data?: PromoAgreementInput } {
    if (!payload || typeof payload !== 'object') {
        return {
            success: false,
            errors: ['Request body must be a JSON object'],
        };
    }

    const {
        customerName,
        serviceAddress,
        phone,
        email,
        agreedToTerms,
        printedName,
        signedDate,
        signatureDataUrl,
        promoLeadId,
    } = payload as Record<string, unknown>;
    const errors: string[] = [];

    const customerNameValue =
        typeof customerName === 'string' ? customerName.trim() : '';
    if (customerNameValue.length === 0) {
        errors.push('Name is required');
    }

    const serviceAddressValue =
        typeof serviceAddress === 'string' ? serviceAddress.trim() : '';
    if (serviceAddressValue.length === 0) {
        errors.push('Service address is required');
    }

    const phoneValue = typeof phone === 'string' ? phone.trim() : '';
    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneValue.length === 0) {
        errors.push('Phone is required');
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.push('Please enter a valid phone number');
    }

    const emailValue = typeof email === 'string' ? email.trim() : '';
    if (emailValue.length === 0) {
        errors.push('Email is required');
    } else if (!emailRegex.test(emailValue)) {
        errors.push('Invalid email format');
    }

    if (agreedToTerms !== true) {
        errors.push('You must agree to the terms');
    }

    const printedNameValue =
        typeof printedName === 'string' ? printedName.trim() : '';
    if (printedNameValue.length === 0) {
        errors.push('Printed name is required');
    }

    const signedDateValue =
        typeof signedDate === 'string' && signedDate.trim().length > 0
            ? signedDate.trim()
            : new Date().toISOString().slice(0, 10);

    const signatureValue =
        typeof signatureDataUrl === 'string' ? signatureDataUrl : '';
    if (signatureValue.length === 0) {
        errors.push('Signature is required');
    } else if (!signatureValue.startsWith(SIGNATURE_PREFIX)) {
        errors.push('Invalid signature format');
    } else if (signatureValue.length > MAX_SIGNATURE_LENGTH) {
        errors.push('Signature image is too large');
    }

    let promoLeadIdValue: number | undefined;
    if (promoLeadId !== undefined && promoLeadId !== null) {
        const parsed = Number(promoLeadId);
        if (Number.isInteger(parsed) && parsed > 0) {
            promoLeadIdValue = parsed;
        }
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        errors: [],
        data: {
            customerName: customerNameValue,
            serviceAddress: serviceAddressValue,
            phone: phoneDigits,
            email: normalizeEmail(emailValue),
            printedName: printedNameValue,
            signedDate: signedDateValue,
            signatureDataUrl: signatureValue,
            promoLeadId: promoLeadIdValue,
        },
    };
}

export function validateNewsletterSubscribePayload(
    payload: unknown
): { success: boolean; errors: string[]; data?: NewsletterSubscribeInput } {
    if (!payload || typeof payload !== 'object') {
        return {
            success: false,
            errors: ['Request body must be a JSON object'],
        };
    }

    const { email, name, source } = payload as Record<string, unknown>;
    const errors: string[] = [];

    const emailValue = typeof email === 'string' ? email.trim() : '';
    if (emailValue.length === 0) {
        errors.push('Email is required');
    } else if (!emailRegex.test(emailValue)) {
        errors.push('Invalid email format');
    }

    let nameValue: string | undefined;
    if (name !== undefined && name !== null) {
        if (typeof name !== 'string') {
            errors.push('Name must be a string');
        } else {
            const trimmed = name.trim();
            if (trimmed.length > 100) {
                errors.push('Name is too long');
            } else if (trimmed.length > 0) {
                nameValue = trimmed;
            }
        }
    }

    let sourceValue: string | undefined;
    if (source !== undefined && source !== null) {
        if (typeof source !== 'string') {
            errors.push('Source must be a string');
        } else {
            const trimmed = source.trim();
            if (trimmed.length > 100) {
                errors.push('Source is too long');
            } else if (trimmed.length > 0) {
                sourceValue = trimmed;
            }
        }
    }

    if (errors.length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        errors: [],
        data: {
            email: normalizeEmail(emailValue),
            name: nameValue,
            source: sourceValue,
        },
    };
}
