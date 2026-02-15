# Stripe Integration Audit — Evergrow Landscaping OKC

**Date:** 2026-02-15
**Auditor:** Claude (automated)
**Project:** Evergrow Landscaping — Next.js 14 + Cloudflare Pages/Workers + D1
**Stripe SDK versions:** `stripe@^20.2.0`, `@stripe/stripe-js@^8.6.4`, `@stripe/react-stripe-js@^5.6.0`

---

## 1. Executive Summary

The Stripe integration is substantially complete at the backend level. Core payment flows (deposit/balance via Stripe Elements and Checkout Session redirect), webhook processing, and email receipts are implemented and functional in test mode once environment secrets are configured.

**Two critical gaps** exist that must be addressed before end-to-end testing works reliably:

1. **Webhook event mismatch** — The webhook handler at `functions/api/webhooks/stripe.ts` only handles `checkout.session.completed`. The `PaymentModal.tsx` uses the Payment Intents flow (`create-deposit`, `create-balance`), which fires `payment_intent.succeeded` — not `checkout.session.completed`. These payments will never be confirmed in the database via webhook until `payment_intent.succeeded` is handled.

2. **Missing secrets** — No Stripe keys are configured. The `.env.local` file does not exist and Cloudflare Pages environment variables have not been set. The integration will fail until keys are added.

---

## 2. Current State Inventory

### 2.1 Backend — Cloudflare Workers (`functions/`)

| File | Status | Notes |
|------|--------|-------|
| `functions/lib/stripe.ts` | ✅ Exists | `getStripeClient`, `createPaymentIntent`, `createDepositPaymentIntent`, `createBalancePayment`, `createCustomer`, `verifyWebhookSignature`, `refundPayment`, retry logic with exponential backoff |
| `functions/api/payment/create-deposit.ts` | ✅ Exists | Creates Payment Intent for 50% deposit; auth-required; validates project status is 'scheduled'; prevents double-payment; returns `clientSecret` |
| `functions/api/payment/create-balance.ts` | ✅ Exists | Creates Payment Intent for balance; auth-required; validates project 'completed' + deposit paid; handles existing pending balance invoices; supports saved payment methods |
| `functions/api/payment/invoice/[id].ts` | ✅ Exists | Creates Stripe Checkout Session (hosted page redirect) for an existing invoice; auth-required; creates Stripe Customer if needed |
| `functions/api/payment/guest-checkout.ts` | ✅ Exists | Guest payment (no login); looks up customer by email; creates Checkout Session |
| `functions/api/payment/guest-lookup.ts` | ✅ Exists | Look up invoices by email for guest checkout |
| `functions/api/payment/save-payment-method.ts` | ✅ Created | Attaches Stripe PM to customer; stores in `payment_methods` table; handles default flag |
| `functions/api/webhooks/stripe.ts` | ⚠️ Partial | Handles `checkout.session.completed` only. Does NOT handle `payment_intent.succeeded` — see Critical Gap §3.1 |

### 2.2 Frontend — Next.js (`app/`, `components/`, `lib/`)

| File | Status | Notes |
|------|--------|-------|
| `components/portal/PaymentModal.tsx` | ✅ Exists | Stripe Elements modal; calls `create-deposit` or `create-balance`; shows fee breakdown; `stripe.confirmPayment()` with redirect on success |
| `components/portal/InvoiceCard.tsx` | ✅ Exists | Displays invoice; "Pay Now" button for pending invoices; triggers PaymentModal |
| `app/pay/page.tsx` | ✅ Exists | Standalone `/pay` page (guest payment entry point) |
| `lib/stripe-client.ts` | ✅ Created | Singleton `stripePromise` and `getStripeClient()` for frontend use |
| `app/payment/deposit/[projectId]/page.tsx` | ❌ Not created | Dedicated deposit payment page (see §4.1) |
| `app/payment/balance/[projectId]/page.tsx` | ❌ Not created | Dedicated balance payment page (see §4.1) |

### 2.3 Database Schema (`migrations/`)

| Field | Table | Status |
|-------|-------|--------|
| `stripe_customer_id` | `customers` | ✅ Migration 001 |
| `stripe_payment_intent_id` | `invoices` | ✅ Migration 001 |
| `stripe_invoice_id` | `invoices` | ✅ Migration 001 |
| `deposit_paid` | `projects` | ✅ Migration 001 |
| `balance_paid` | `projects` | ✅ Migration 001 |
| `payment_methods` table | — | ✅ Created (Migration 006) |
| Index: `idx_customers_stripe_id` | `customers` | ✅ Migration 001 |
| Index: `idx_invoices_stripe_pi` | `invoices` | ✅ Migration 001 |
| Index: `idx_invoices_stripe_invoice_id` | `invoices` | ✅ Migration 006 |

### 2.4 Environment Configuration

| Item | Status | Location |
|------|--------|---------|
| `.env.example` template | ✅ Created | `/.env.example` |
| `.env.local` (dev secrets) | ❌ Not created | Create locally; never commit |
| `STRIPE_SECRET_KEY` secret | ❌ Not set | `wrangler secret put STRIPE_SECRET_KEY` |
| `STRIPE_WEBHOOK_SECRET` secret | ❌ Not set | `wrangler secret put STRIPE_WEBHOOK_SECRET` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ Not set | In `.env.local` + Cloudflare Pages env vars |
| `RESEND_API_KEY` secret | ❌ Not set | `wrangler secret put RESEND_API_KEY` |
| `SESSION_SECRET` / `JWT_SECRET` | ❌ Not set | `wrangler secret put ...` |
| `wrangler.toml` | ✅ Updated | Added secret setup instructions as comments |

### 2.5 Email (`functions/lib/email.ts`)

| Function | Status | Notes |
|----------|--------|-------|
| `sendEmail(env, params)` | ✅ Exists | Resend API integration |
| `getPaymentReceiptEmail(params)` | ✅ Exists | HTML receipt template with Evergrow branding |
| Receipt called from webhook | ✅ Exists | On `checkout.session.completed` only (see Critical Gap §3.1) |

---

## 3. Critical Gaps

### 3.1 Webhook Event Mismatch (HIGH PRIORITY)

**Problem:**
There are two parallel payment flows in the codebase:

| Flow | Endpoint | Stripe object created | Webhook event needed |
|------|----------|-----------------------|----------------------|
| Elements (PaymentModal) | `POST /api/payment/create-deposit` | Payment Intent | `payment_intent.succeeded` |
| Elements (PaymentModal) | `POST /api/payment/create-balance` | Payment Intent | `payment_intent.succeeded` |
| Hosted Checkout | `POST /api/payment/invoice/[id]` | Checkout Session | `checkout.session.completed` |

The webhook at `functions/api/webhooks/stripe.ts` **only handles `checkout.session.completed`**. When a customer pays via `PaymentModal.tsx` (the Elements flow), Stripe fires `payment_intent.succeeded` — which is currently unhandled.

**Impact:** Payments made through `PaymentModal.tsx` will appear successful to the customer on the frontend but the database will NOT update: invoice status stays `pending`, `deposit_paid`/`balance_paid` stay false, and no receipt email is sent.

**Fix required:** Add a `payment_intent.succeeded` case to the webhook handler that:
1. Extracts `projectId` and `invoiceType` from `paymentIntent.metadata`
2. Updates `invoices.status = 'paid'` and sets `paid_at`
3. Updates `projects.deposit_paid` or `projects.balance_paid`
4. Sends payment receipt email via `sendEmail`

**Alternatively:** If the hosted Checkout flow (`invoice/[id].ts`) is deprecated in favour of Elements, remove it and rely solely on `payment_intent.succeeded`.

---

## 4. Missing Components (Non-Critical)

### 4.1 Dedicated Payment Pages

The task specification requests standalone pages at:
- `/app/payment/deposit/[projectId]/page.tsx`
- `/app/payment/balance/[projectId]/page.tsx`

These are not implemented. Currently payment is accessed through `PaymentModal.tsx` on the invoice list page (`/portal/invoices`). Dedicated pages may be useful for direct links from emails or admin shares, but are not blocking end-to-end functionality.

### 4.2 Stripe API Version Inconsistency

Two different API versions are in use:
- `functions/lib/stripe.ts`: No explicit `apiVersion` set (uses SDK default)
- `functions/api/webhooks/stripe.ts`: `apiVersion: '2024-12-18.acacia'`
- `functions/api/payment/invoice/[id].ts`: `apiVersion: '2024-12-18.acacia'`

Recommend standardising to one version across all files.

### 4.3 Transaction Fee Display

`PaymentModal.tsx` calculates and displays a 2.9% + $0.30 fee to the customer. This is the Stripe processing fee but it is being added to the customer-facing total, implying the customer pays this. If the business intends to absorb processing fees, this display is incorrect. Verify the fee-passing policy with the client before launch.

### 4.4 Stripe Customer Creation Gap

`create-deposit.ts` and `create-balance.ts` return a 500 error if `customers.stripe_customer_id` is null. Only `invoice/[id].ts` creates a Stripe customer on-the-fly if missing. The customer registration flow (`functions/api/auth/register.ts`) should create a Stripe customer at registration time and store the ID — if it does not, authenticated users may hit this 500 error.

---

## 5. Security Assessment

| Control | Status | Notes |
|---------|--------|-------|
| Webhook signature verification | ✅ Implemented | `stripe.webhooks.constructEvent()` in webhook handler |
| API auth on payment endpoints | ✅ Implemented | `requireAuth()` middleware on all authenticated endpoints |
| HTTPS | ✅ Cloudflare enforced | All traffic through Cloudflare Pages |
| No raw card data on server | ✅ Stripe Elements | Card data never touches Workers; PCI SAQ A compliant |
| Secrets in env, not code | ✅ Correct pattern | Keys read from `env.STRIPE_SECRET_KEY` |
| `.env*` in `.gitignore` | ✅ Correct | Pattern `.env*` covers all env files |
| Rate limiting on payment endpoints | ❌ Missing | No rate limiting implemented; add Cloudflare rate limiting rules |
| Input validation | ✅ Implemented | `projectId` validated as positive integer; `paymentMethodId` format checked |
| Customer ownership check | ✅ Implemented | `WHERE id = ? AND customer_id = ?` prevents cross-customer access |

---

## 6. Configuration Gaps Summary

### Cloudflare Secrets Required
Run these commands with real values (do not commit keys to git):
```bash
wrangler secret put STRIPE_SECRET_KEY        # sk_test_... for test, sk_live_... for prod
wrangler secret put STRIPE_WEBHOOK_SECRET    # whsec_... from Stripe Dashboard
wrangler secret put RESEND_API_KEY           # re_... from Resend Dashboard
wrangler secret put SESSION_SECRET           # openssl rand -base64 32
wrangler secret put JWT_SECRET               # openssl rand -base64 32
```

### Next.js Frontend
Create `.env.local` (copied from `.env.example`):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Also add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Cloudflare Pages environment variables (Settings > Environment Variables) for production builds.

### Stripe Dashboard (Test Mode)
1. Create webhook endpoint: `https://evergrowlandscaping.com/api/webhooks/stripe`
2. Subscribe to events:
   - `checkout.session.completed`
   - `payment_intent.succeeded` ← **add this; currently unhandled but needed**
   - `payment_intent.payment_failed`
3. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## 7. File Structure Reference

```
functions/
├── api/
│   ├── payment/
│   │   ├── create-deposit.ts        ✅ Payment Intent for 50% deposit
│   │   ├── create-balance.ts        ✅ Payment Intent for remaining balance
│   │   ├── save-payment-method.ts   ✅ Save/attach Stripe payment method
│   │   ├── guest-checkout.ts        ✅ Guest Checkout Session
│   │   ├── guest-lookup.ts          ✅ Guest invoice lookup by email
│   │   └── invoice/
│   │       └── [id].ts              ✅ Hosted Checkout Session per invoice
│   └── webhooks/
│       └── stripe.ts                ⚠️  Handles checkout.session.completed only
├── lib/
│   ├── stripe.ts                    ✅ Stripe client, helpers, retry logic
│   └── email.ts                     ✅ Resend integration, receipt template
└── types.ts                         ✅ Env + DB type definitions

components/portal/
├── PaymentModal.tsx                  ✅ Stripe Elements checkout form
└── InvoiceCard.tsx                  ✅ Invoice display with Pay Now button

lib/
└── stripe-client.ts                 ✅ Client-side Stripe singleton

migrations/
├── 001_initial_schema.sql           ✅ Core tables + Stripe fields
└── 006_payment_methods.sql          ✅ payment_methods table + indexes

docs/
├── stripe-integration-audit.md     ✅ This document
├── stripe-testing-guide.md         ✅ Testing procedures
└── stripe-production-checklist.md  ✅ Go-live requirements
```

---

## 8. Recommended Next Actions (Priority Order)

1. **[HIGH]** Fix webhook to handle `payment_intent.succeeded` — the Elements-based payment flow will not update the database without this
2. **[HIGH]** Set Cloudflare secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.) and create `.env.local`
3. **[HIGH]** Run migration 006 on D1: `wrangler d1 execute evergrow-landscaping-db --file=migrations/006_payment_methods.sql`
4. **[HIGH]** Verify Stripe Customer creation happens at user registration — check `functions/api/auth/register.ts`
5. **[MEDIUM]** Standardise Stripe API version across all files
6. **[MEDIUM]** Add Cloudflare rate limiting rules for `/api/payment/*` endpoints
7. **[MEDIUM]** Confirm fee-passing policy (customer pays 2.9%+$0.30, or business absorbs it)
8. **[LOW]** Create dedicated `/app/payment/deposit/[projectId]` and `/app/payment/balance/[projectId]` pages if needed for direct-link flows
