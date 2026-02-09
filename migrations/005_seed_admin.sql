-- Migration: Seed demo admin account
-- Date: 2026-02-09
-- Description: Inserts a demo admin user for development/testing
-- Credentials: admin@evergrowlandscaping.com / admin123

INSERT OR IGNORE INTO customers (
  email,
  name,
  phone,
  role,
  password_hash,
  email_verified
) VALUES (
  'admin@evergrowlandscaping.com',
  'Connor McNeely',
  '405-479-5794',
  'admin',
  'pbkdf2:100000:b32ad1ed1edfb86476fd8c4070ed797f:09b92cbcb052c36dfddf2e5027432e65450c4d545cc128a8594a927a444b80b3',
  1
);
