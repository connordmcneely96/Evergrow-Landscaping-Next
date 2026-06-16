CREATE TABLE IF NOT EXISTS service_agreements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  promo_lead_id INTEGER,
  customer_name TEXT NOT NULL,
  service_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_provider TEXT NOT NULL DEFAULT 'Evergrow Landscaping',
  agreed_to_terms INTEGER NOT NULL DEFAULT 0,
  printed_name TEXT NOT NULL,
  signed_date TEXT NOT NULL,
  terms_version TEXT NOT NULL DEFAULT 'v1',
  pdf_r2_key TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'signed',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (promo_lead_id) REFERENCES promo_leads(id)
);

CREATE INDEX IF NOT EXISTS idx_service_agreements_email ON service_agreements(email);
CREATE INDEX IF NOT EXISTS idx_service_agreements_lead ON service_agreements(promo_lead_id);
CREATE INDEX IF NOT EXISTS idx_service_agreements_created ON service_agreements(created_at);
