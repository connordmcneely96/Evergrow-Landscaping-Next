-- ============================================
-- QUICK TEST INVOICE SETUP FOR STRIPE PAYMENT
-- ============================================
-- Run this in Cloudflare D1 Console to create test data
-- ============================================

-- Step 1: Create test customer with simple password
INSERT OR REPLACE INTO customers (
    id,
    email,
    name,
    phone,
    password_hash,
    email_verified,
    created_at,
    updated_at
) VALUES (
    999,
    '[email protected]',
    'Test Customer',
    '555-0123',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye7FrYxYpYIRxH5O.hy8O0SwPAVJGM.6G',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Step 2: Create test project
INSERT OR REPLACE INTO projects (
    id,
    customer_id,
    service_type,
    description,
    total_amount,
    deposit_amount,
    deposit_paid,
    balance_paid,
    scheduled_date,
    status,
    created_at
) VALUES (
    999,
    999,
    'lawn-care',
    'Test Lawn Care Project for Stripe Demo',
    300.00,
    150.00,
    0,
    0,
    DATE('now', '+7 days'),
    'scheduled',
    CURRENT_TIMESTAMP
);

-- Step 3: Create PENDING INVOICE (this is what shows the Pay Now button!)
INSERT OR REPLACE INTO invoices (
    id,
    project_id,
    customer_id,
    amount,
    invoice_type,
    description,
    status,
    due_date,
    created_at
) VALUES (
    999,
    999,
    999,
    150.00,
    'deposit',
    'Deposit payment for lawn care service - STRIPE TEST',
    'pending',
    DATE('now', '+3 days'),
    CURRENT_TIMESTAMP
);

-- Step 4: Verify the data was created
SELECT
    'Customer Created' as table_name,
    c.id,
    c.email,
    c.name
FROM customers c
WHERE c.id = 999
UNION ALL
SELECT
    'Project Created',
    p.id,
    p.service_type,
    CAST(p.total_amount AS TEXT)
FROM projects p
WHERE p.id = 999
UNION ALL
SELECT
    'Invoice Created',
    i.id,
    i.status,
    CAST(i.amount AS TEXT)
FROM invoices i
WHERE i.id = 999;

-- ============================================
-- LOGIN CREDENTIALS:
-- Email: [email protected]
-- Password: test123
-- ============================================
-- After logging in:
-- 1. Go to "Invoices" in sidebar
-- 2. You'll see a $150.00 invoice
-- 3. Click the teal "Pay Now" button
-- 4. Stripe Checkout will open
-- ============================================
