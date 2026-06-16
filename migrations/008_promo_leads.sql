CREATE TABLE IF NOT EXISTS promo_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT DEFAULT 'promo-lawn-maintenance',
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promo_leads_email ON promo_leads(email);
CREATE INDEX IF NOT EXISTS idx_promo_leads_created ON promo_leads(created_at);
