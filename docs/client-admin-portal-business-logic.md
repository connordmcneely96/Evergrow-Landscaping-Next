# Client Portal + Admin Portal Business Logic (Simple Explanation)

## One-line summary
The system runs on a simple loop: **customer requests quote → admin sends quote → customer accepts → project/invoice is created → customer pays in Stripe → webhook marks invoice paid and sends receipt email**.

---

## 1) Customer Journey (End to End)

### Stage A — Lead comes in
1. Customer submits a quote request form on the website.
2. A quote record is created in `pending` state.
3. Admin sees this in the admin portal and can respond.

### Stage B — Admin sends a quote
1. Admin opens the quote, enters price/notes/timeline/terms, and sends it.
2. System updates quote to `quoted`, sets 30-day validity, and generates a secure acceptance token link.
3. Customer receives a quote email with that acceptance link.

### Stage C — Customer accepts the quote
1. Customer opens the acceptance page and clicks **Accept Quote**.
2. System changes quote status to `accepted`.
3. System creates:
   - a **project** (scheduled),
   - a **deposit invoice** (default 50%),
   - and sends the deposit invoice/payment email.

### Stage D — Customer pays (Stripe)
There are two supported payment paths:
1. **Portal/Elements path** (logged-in portal): creates Stripe PaymentIntent + uses Stripe Elements modal.
2. **Guest checkout path** (`/pay`): customer enters email + invoice and gets redirected to Stripe Checkout hosted page.

### Stage E — Payment confirmation and accounting updates
1. Stripe sends webhook events (`checkout.session.completed` or `payment_intent.succeeded`).
2. Webhook verifies signature, marks invoice `paid`, sets `paid_at`, and updates project flags:
   - deposit invoice paid → `deposit_paid = 1`
   - balance invoice paid → `balance_paid = 1`
3. Receipt email is sent to customer.

### Stage F — Final balance
1. Once project status is `completed`, balance invoice/payment is allowed.
2. Same Stripe + webhook loop marks final payment paid.

---

## 2) Admin Portal Business Logic

The admin portal is operational control:
- **Dashboard:** shows pending quotes, accepted volume, active projects.
- **Quotes:** admin can send quote (with secure accept token) or decline.
- **Projects:** tracks lifecycle (`scheduled`, `in_progress`, `completed`, etc.).

Important business rule:
- Quotes can only be sent from valid states (pending/quoted resend allowed).
- Customer cannot accept expired or invalid-token quotes.

---

## 3) Client Portal Business Logic

The client portal is customer self-service:
- View projects and status.
- View invoices (pending/paid), due dates, and payment links.
- Pay deposit/balance from portal.
- Leave feedback.

Important payment gates:
- Deposit payment is allowed only when project is `scheduled` and deposit not already paid.
- Balance payment is allowed only when project is `completed` and deposit already paid.

---

## 4) How Stripe Fits In (Plain English)

Stripe is the payment engine, not the CRM.
Your app still controls:
- who owes what (invoice rows in DB),
- when payment is allowed (business rules),
- and project status.

Stripe controls:
- secure card collection,
- payment authorization/capture,
- checkout pages/elements,
- and payment events.

Webhook is the bridge:
- Stripe says “payment succeeded.”
- Your app updates invoice/project records and sends receipt.

This is exactly the right architecture for service businesses.

---

## 5) What to tell a stressed client right now (EIN just approved)

Use this script:

> “The software is already built to run payments in Stripe test mode and production mode. Your EIN approval is the normal prerequisite for fully activating Stripe business details and payouts. That admin setup timing does **not** mean the portal logic is broken—it just means Stripe account verification/payout readiness is still being finalized. Once Stripe business verification is complete and live keys/webhook are set, the same workflow goes live immediately.”

And this timeline framing:
- **Now:** keep proving full flow in Stripe test mode (quote → accept → deposit → webhook → receipt).
- **As soon as Stripe live onboarding clears:** switch live keys + webhook secret.
- **Result:** no rewrite needed; just configuration cutover.

---

## 6) Go-Live Checklist (Non-technical)

1. Stripe business profile complete (legal name, EIN, bank, owners).
2. Live API keys added to environment.
3. Live webhook endpoint configured.
4. Do one $1 live payment test and verify receipt + invoice status update.
5. Refund test charge.
6. Announce portal payments live.

---

## 7) Reassurance in one sentence

You are **not behind on engineering**; you are mainly waiting on standard Stripe business verification and then doing a controlled key/webhook cutover.
