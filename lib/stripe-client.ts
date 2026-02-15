import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Returns a singleton Stripe.js instance for use in frontend components.
 * Lazily initialized on first call to avoid loading Stripe until needed.
 *
 * Usage:
 *   import { getStripeClient } from '@/lib/stripe-client'
 *   const stripe = await getStripeClient()
 */
export function getStripeClient(): Promise<Stripe | null> {
    if (!stripePromise) {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!key) {
            console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
            return Promise.resolve(null);
        }
        stripePromise = loadStripe(key);
    }
    return stripePromise;
}

/**
 * Pre-loaded Stripe promise for use with @stripe/react-stripe-js <Elements>.
 * Import this directly into components that use the Elements provider.
 *
 * Usage:
 *   import { stripePromise } from '@/lib/stripe-client'
 *   <Elements stripe={stripePromise} options={{ clientSecret }}>
 */
export const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
);
