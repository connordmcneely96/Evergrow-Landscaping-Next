# Stripe Payment Setup & Testing Guide

## Quick Start: See Stripe Payment Working

### Step 1: Create Test Invoice in Database

Run this in your **Cloudflare D1 Console**:

1. Go to: https://dash.cloudflare.com → D1 → evergrow-landscaping-db → Console tab
2. Copy all contents from `create-stripe-test-invoice.sql`
3. Paste and Execute

This creates:
- Test customer: `[email protected]`
- Test password: `test123`
- Test invoice: `$150.00` with status `pending`

### Step 2: Configure Stripe Keys

**Get Test Keys from Stripe:**
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)

**Add to Cloudflare Pages:**
1. Go to: Cloudflare Dashboard → Pages → evergrow-landscaping → Settings → Environment variables
2. Add these variables for **Production** environment:
   ```
   STRIPE_SECRET_KEY = sk_test_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx
   ```
3. Click **Save**
4. **Redeploy** your site

**Create Webhook Endpoint:**
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL**: `https://evergrowlandscaping.com/api/webhooks/stripe`
4. **Events to send**: Select these two:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add this as `STRIPE_WEBHOOK_SECRET` in Cloudflare Pages (step above)

### Step 3: Test the Payment Flow

1. **Login to Portal**
   - Go to: https://evergrowlandscaping.com/portal/login
   - Email: `[email protected]`
   - Password: `test123`

2. **View Invoices**
   - Click **"Invoices"** in the sidebar
   - Or click **"Make a Payment"** in the header
   - You should see: **Invoice #999** for **$150.00**

3. **Click "Pay Now"**
   - You'll see a teal button: **💳 Pay Now**
   - Click it
   - You'll be redirected to **Stripe Checkout**

4. **Complete Test Payment**
   Use these test card numbers:

   **Successful payment:**
   ```
   Card number: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 12345)
   ```

   **Requires authentication (3D Secure):**
   ```
   Card number: 4000 0025 0000 3155
   ```

   **Payment declined:**
   ```
   Card number: 4000 0000 0000 9995
   ```

5. **See Success Page**
   - After payment, you'll be redirected to `/portal/invoices/success`
   - You'll see: ✅ **Payment Successful!**

6. **Check Invoice Updated**
   - Go back to **Invoices**
   - The invoice should now show: **✓ Paid**
   - The **Pay Now** button should be gone

7. **Check Email Receipt**
   - Check the email: `[email protected]`
   - You should receive a payment receipt email

---

## Troubleshooting

### "Pay Now" button doesn't appear

**Check 1: Invoice Status**
```sql
SELECT id, status, amount FROM invoices WHERE customer_id = 999;
```
Status MUST be `pending` to show the button.

**Check 2: You're logged in as the right customer**
- Email must be `[email protected]`
- Password is `test123`

**Check 3: Clear browser cache and reload**

### Payment fails immediately

**Check 1: Stripe keys are set**
```bash
# In Cloudflare Pages → Settings → Environment Variables
# Must have both:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Check 2: Site was redeployed after adding keys**
- After adding environment variables, you MUST redeploy
- Go to Cloudflare Pages → Deployments → Retry deployment

**Check 3: Check Cloudflare Functions logs**
- Go to Cloudflare Pages → Functions
- Look for errors in `/api/payment/invoice/[id]`

### Webhook not updating invoice status

**Check 1: Webhook endpoint is configured**
- Stripe Dashboard → Webhooks
- URL should be: `https://evergrowlandscaping.com/api/webhooks/stripe`
- Events should include: `checkout.session.completed`

**Check 2: Webhook secret is correct**
- Copy signing secret from Stripe webhook settings
- Add as `STRIPE_WEBHOOK_SECRET` in Cloudflare

**Check 3: Check webhook delivery in Stripe**
- Stripe Dashboard → Webhooks → Your endpoint → Events
- Look for failed deliveries
- Click on event to see error details

### Email receipt not sending

**Check 1: RESEND_API_KEY is set**
```bash
# In Cloudflare Pages → Settings → Environment Variables
RESEND_API_KEY=re_...
```

**Check 2: Check Cloudflare Functions logs**
- Look for email sending errors
- Webhook logs will show if email failed

---

## Going Live (Production)

When ready for real payments:

### 1. Switch to Live Mode in Stripe
- Get **live** API keys from: https://dashboard.stripe.com/apikeys
- Create **live** webhook endpoint

### 2. Update Cloudflare Environment Variables
```bash
STRIPE_SECRET_KEY = sk_live_xxxxxxxxxxxxx  # NOT sk_test_
STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx  # Live webhook secret
```

### 3. Test with Real Card
- Use a real credit card
- Test with small amount first ($1.00)
- Verify invoice updates
- Verify email receipt arrives

### 4. Enable Additional Payment Methods (Optional)
In Stripe Dashboard → Settings → Payment Methods:
- ✅ Cards (already enabled)
- ✅ Apple Pay
- ✅ Google Pay
- Consider: ACH Direct Debit, Link, etc.

---

## API Endpoints Reference

### Payment Endpoints

**Create Checkout Session:**
```
POST /api/payment/invoice/{id}
Headers: Authorization: Bearer {token}

Returns:
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Webhook Handler:**
```
POST /api/webhooks/stripe
Headers: stripe-signature: {signature}

Handles:
- checkout.session.completed → Updates invoice to 'paid'
- payment_intent.payment_failed → Logs failure
```

**Get Customer Invoices:**
```
GET /api/customer/invoices
Headers: Authorization: Bearer {token}

Returns:
{
  "success": true,
  "invoices": [
    {
      "id": 1,
      "amount": 150.00,
      "status": "pending",
      "canPay": true
    }
  ]
}
```

---

## Database Schema

**Invoices Table:**
```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  project_id INTEGER,
  customer_id INTEGER,
  amount REAL,
  invoice_type TEXT,  -- 'deposit', 'balance', 'full'
  status TEXT,        -- 'pending', 'sent', 'paid', 'overdue'
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  due_date TEXT,
  paid_at TEXT,
  created_at TEXT
);
```

**Key Fields for Stripe:**
- `status` = 'pending' → Shows "Pay Now" button
- `status` = 'paid' → Shows "Paid" badge
- `stripe_payment_intent_id` → Saved after successful payment
- `paid_at` → Timestamp when payment completed

---

## Support

If you encounter issues:

1. **Check Cloudflare Functions logs**
   - Pages → Functions → Real-time logs

2. **Check Stripe Dashboard**
   - Payments → Events
   - Webhooks → Endpoint → Events

3. **Check browser console**
   - F12 → Console tab
   - Look for JavaScript errors

4. **Database queries**
   ```sql
   -- Check customer exists
   SELECT * FROM customers WHERE email = '[email protected]';

   -- Check invoice status
   SELECT * FROM invoices WHERE customer_id = 999;

   -- Check project payment flags
   SELECT deposit_paid, balance_paid FROM projects WHERE id = 999;
   ```

---

## Files Reference

**Frontend:**
- `/app/portal/(authenticated)/invoices/page.tsx` - Invoice list with Pay Now button
- `/app/portal/(authenticated)/invoices/success/page.tsx` - Success confirmation

**Backend:**
- `/functions/api/payment/invoice/[id].ts` - Create Stripe checkout session
- `/functions/api/webhooks/stripe.ts` - Handle Stripe webhook events
- `/functions/api/customer/invoices.ts` - Fetch customer invoices

**Database:**
- `/migrations/001_initial.sql` - Invoices table schema
- `/create-stripe-test-invoice.sql` - Test data creation script

---

## Test Card Numbers Reference

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0000 0000 9995` | Declined |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0127` | Incorrect CVC |

All test cards:
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

More test cards: https://stripe.com/docs/testing
