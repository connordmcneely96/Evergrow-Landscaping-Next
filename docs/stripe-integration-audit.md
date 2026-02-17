# Stripe Integration Audit — Evergrow Landscaping OKC

**Date:** 2026-02-15 (re-audited and updated)
**Project:** Evergrow Landscaping — Next.js 14 + Cloudflare Pages/Workers + D1
**Stripe SDK versions:** `stripe@^20.2.0`, `@stripe/stripe-js@^8.6.4`, `@stripe/react-stripe-js@^5.6.0`

---

## 1. Executive Summary

The Stripe integration is fully implemented at the code level and ready for end-to-end test mode verification. All previously identified critical code gaps have been resolved in this audit cycle.

**Remaining blockers before test mode can be verified:**
- Cloudflare secrets are not set (no live credentials)
- Migration 006 has not been applied to the D1 database
- Stripe webhook endpoint has not been configured in the Stripe Dashboard

**Remaining blockers before production go-live:**
- Stripe account verification (EIN, legal name, identity) still pending
- Bank account not yet linked

---

## 2. Current State Inventory

### 2.1 Backend — Cloudflare Workers (`functions/`)

| File | Status | Notes |
|------|--------|-------|
| `functions/lib/stripe.ts` | ✅ Fixed | `getStripeClient`, payment intent helpers, retry logic. `apiVersion: '2024-12-18.acacia'` now pinned |
| `functions/api/payment/create-deposit.ts` | ✅ Complete | Payment Intent for 50% deposit; auth-required; validates project status; returns `clientSecret` |
| `functions/api/payment/create-balance.ts` | ✅ Complete | Payment Intent for remaining balance; handles existing pending PIs; supports saved methods |
| `functions/api/payment/invoice/[id].ts` | ✅ Complete | Hosted Checkout Session per invoice; creates Stripe Customer on-the-fly if missing |
| `functions/api/payment/guest-checkout.ts` | ✅ Complete | Guest Checkout Session by email |
| `functions/api/payment/guest-lookup.ts` | ✅ Complete | Invoice lookup by email for guest checkout |
| `functions/api/payment/save-payment-method.ts` | ✅ Complete | Attaches PM to Stripe customer; stores in `payment_methods` D1 table; handles default |
| `functions/api/webhooks/stripe.ts` | ✅ Fixed | Now handles `checkout.session.completed`, `payment_intent.succeeded`, and `payment_intent.payment_failed` |
| `functions/api/auth/register.ts` | ✅ Fixed | Now creates Stripe customer at registration; stores `stripe_customer_id`; non-fatal on failure |

### 2.2 Frontend — Next.js

| File | Status | Notes |
|------|--------|-------|
| `components/portal/PaymentModal.tsx` | ✅ Complete | Stripe Elements modal; calls `create-deposit`/`create-balance`; fee breakdown; `confirmPayment()` |
| `components/portal/InvoiceCard.tsx` | ✅ Complete | Invoice display; "Pay Now" for pending invoices |
| `app/pay/page.tsx` | ✅ Complete | Guest payment entry point |
| `lib/stripe-client.ts` | ✅ Complete | `stripePromise` singleton + `getStripeClient()` lazy loader |

### 2.3 Database Schema

| Item | Status |
|------|--------|
| `customers.stripe_customer_id` | ✅ Migration 001 |
| `invoices.stripe_payment_intent_id` | ✅ Migration 001 |
| `invoices.stripe_invoice_id` | ✅ Migration 001 |
| `projects.deposit_paid` / `projects.balance_paid` | ✅ Migration 001 |
| `payment_methods` table | ✅ Migration 006 (created, not yet applied to D1) |
| Indexes on all Stripe ID fields | ✅ Migrations 001 + 006 |

### 2.4 Configuration

| Item | Status | Action Needed |
|------|--------|---------------|
| `.env.example` | ✅ Exists | Copy to `.env.local` and fill in test keys |
| `.env.local` | ❌ Not created | Developer must create locally |
| `STRIPE_SECRET_KEY` Cloudflare secret | ❌ Not set | `wrangler secret put STRIPE_SECRET_KEY` |
| `STRIPE_WEBHOOK_SECRET` Cloudflare secret | ❌ Not set | `wrangler secret put STRIPE_WEBHOOK_SECRET` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ Not set | Add to `.env.local` + Cloudflare Pages env vars |
| `wrangler.toml` | ✅ Updated | Secret setup instructions documented as comments |

### 2.5 Email

| Item | Status |
|------|--------|
| `sendEmail()` via Resend | ✅ Complete |
| `getPaymentReceiptEmail()` template | ✅ Complete |
| Receipt sent on `checkout.session.completed` | ✅ Complete |
| Receipt sent on `payment_intent.succeeded` | ✅ Fixed |

### 2.6 Documentation

| File | Status |
|------|--------|
| `docs/stripe-integration-audit.md` | ✅ This document |
| `docs/stripe-testing-guide.md` | ✅ Complete |
| `docs/stripe-production-checklist.md` | ✅ Complete |
| `STRIPE-TESTING-GUIDE.md` (root) | ✅ Exists (original, now superseded by `docs/`) |

---

## 3. Payment Flow Architecture

Two parallel payment flows exist in the codebase. Both are now fully supported end-to-end:

### Flow A: Stripe Elements (Primary — used by PaymentModal)
```
Customer → PaymentModal → POST /api/payment/create-deposit (or create-balance)
         → Stripe Payment Intent created → clientSecret returned
         → Customer fills card in Elements → stripe.confirmPayment()
         → Stripe fires payment_intent.succeeded
         → Webhook updates DB + sends receipt email
```
**Webhook event:** `payment_intent.succeeded` ✅ Now handled

### Flow B: Hosted Checkout (used by InvoiceCard direct link)
```
Customer → POST /api/payment/invoice/[id]
         → Stripe Checkout Session created → redirect URL returned
         → Customer redirected to Stripe's hosted page
         → Stripe fires checkout.session.completed
         → Webhook updates DB + sends receipt email
```
**Webhook event:** `checkout.session.completed` ✅ Handled

---

## 4. Resolved Issues (This Audit Cycle)

| Issue | Resolution |
|-------|-----------|
| Webhook missing `payment_intent.succeeded` | Added handler in `functions/api/webhooks/stripe.ts` with idempotency check |
| No Stripe customer created at registration | `register.ts` now calls `createStripeCustomer()` post-insert; non-fatal on error |
| `apiVersion` not pinned in `functions/lib/stripe.ts` | Pinned to `'2024-12-18.acacia'` to match all other files |
| `payment_methods` table missing | Created via `migrations/006_payment_methods.sql` |
| `save-payment-method.ts` endpoint missing | Created at `functions/api/payment/save-payment-method.ts` |
| `lib/stripe-client.ts` missing | Created with singleton pattern |
| `stripePromise` variable redeclaration build error | Fixed: internal variable renamed to `_stripeInstance` |

---

## 5. Remaining Gaps

### 5.1 Secrets Not Configured (Blocks All Testing)

No Stripe API keys or webhook secrets are set. The integration will return 500 errors until these are added.

```bash
wrangler secret put STRIPE_SECRET_KEY        # sk_test_...
wrangler secret put STRIPE_WEBHOOK_SECRET    # whsec_...
wrangler secret put RESEND_API_KEY           # re_...
wrangler secret put SESSION_SECRET
wrangler secret put JWT_SECRET
```

Also set in `.env.local` for Next.js frontend:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5.2 Migration 006 Not Applied

The `payment_methods` table does not exist in the D1 database yet.

```bash
wrangler d1 execute evergrow-landscaping-db \
  --file=migrations/006_payment_methods.sql
```

### 5.3 Webhook Endpoint Not Configured in Stripe Dashboard

Even after setting the secret, the webhook will not receive events until the endpoint is registered.

1. Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://evergrowlandscaping.com/api/webhooks/stripe`
3. Subscribe to events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy signing secret → `wrangler secret put STRIPE_WEBHOOK_SECRET`

### 5.4 Transaction Fee Policy (UX)

`PaymentModal.tsx` adds a 2.9% + $0.30 fee on top of the invoice amount before showing the customer the total. This implies the **customer pays the processing fee**. Verify this is intentional with the client — if the business absorbs fees, remove the fee display and collect the exact invoice amount.

### 5.5 Stripe Account Verification (Blocks Production)

- EIN entered but awaiting Stripe verification
- Legal business name pending approval
- Identity verification may be required
- Bank account not linked (blocks payouts)

See `docs/stripe-production-checklist.md` for the complete go-live checklist.

### 5.6 Rate Limiting (Security)

No rate limiting on payment endpoints. Recommend Cloudflare rate limiting rules:
- `/api/payment/*` — 10 req/min per IP
- `/api/auth/login` — 5 req/min per IP

---

## 6. Security Assessment

| Control | Status | Notes |
|---------|--------|-------|
| Webhook signature verification | ✅ | `stripe.webhooks.constructEvent()` |
| Auth required on payment endpoints | ✅ | `requireAuth()` middleware |
| Customer ownership enforced | ✅ | `WHERE id = ? AND customer_id = ?` |
| No raw card data on server | ✅ | Stripe Elements / PCI SAQ A |
| Secrets in env, not source | ✅ | Keys from `env.STRIPE_SECRET_KEY` |
| `.env*` in `.gitignore` | ✅ | `.env.local` never committed |
| Idempotent webhook processing | ✅ | Status check prevents double-marking |
| HTTPS | ✅ | Cloudflare enforced |
| Rate limiting | ❌ | Not implemented |

---

## 7. File Structure Reference

```
functions/
├── api/
│   ├── auth/
│   │   └── register.ts          ✅ Creates Stripe customer at registration
│   ├── payment/
│   │   ├── create-deposit.ts    ✅ 50% deposit Payment Intent
│   │   ├── create-balance.ts    ✅ Balance Payment Intent + saved method support
│   │   ├── save-payment-method.ts ✅ Attach/store Stripe payment methods
│   │   ├── guest-checkout.ts    ✅ Guest Checkout Session
│   │   ├── guest-lookup.ts      ✅ Invoice lookup by email
│   │   └── invoice/[id].ts      ✅ Hosted Checkout Session per invoice
│   └── webhooks/
│       └── stripe.ts            ✅ Handles succeeded + session.completed + failed
├── lib/
│   ├── stripe.ts                ✅ Client, helpers, retry, apiVersion pinned
│   └── email.ts                 ✅ Resend + receipt template

lib/
└── stripe-client.ts             ✅ Client-side singleton

migrations/
├── 001_initial_schema.sql       ✅ Core tables + Stripe fields
└── 006_payment_methods.sql      ✅ payment_methods table (not yet applied to D1)

.env.example                     ✅ Template for all required env vars
wrangler.toml                    ✅ Secret setup instructions documented

docs/
├── stripe-integration-audit.md ✅ This document
├── stripe-testing-guide.md      ✅ Test cards, flows, webhook CLI, DB queries
└── stripe-production-checklist.md ✅ Verification, payout, compliance, go-live
```

---

## 8. Next Actions (Priority Order)

| # | Priority | Action |
|---|----------|--------|
| 1 | HIGH | Set Cloudflare secrets (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, etc.) |
| 2 | HIGH | Create `.env.local` with `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` |
| 3 | HIGH | Run `migrations/006_payment_methods.sql` on D1 |
| 4 | HIGH | Register webhook endpoint in Stripe Dashboard; subscribe to all 3 events |
| 5 | HIGH | Run end-to-end test with card `4242 4242 4242 4242` per testing guide |
| 6 | MEDIUM | Confirm transaction fee policy (customer pays vs. business absorbs) |
| 7 | MEDIUM | Add Cloudflare rate limiting rules for payment and auth endpoints |
| 8 | BLOCKING | Complete Stripe account verification (EIN, identity, legal name) |
| 9 | BLOCKING | Link bank account in Stripe Dashboard for payouts |
