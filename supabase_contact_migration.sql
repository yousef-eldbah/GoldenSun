-- ==============================================================================
-- Migration: Contact Inquiries & Admin Login Attempts
-- ==============================================================================

-- 1. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT DEFAULT '',
  company TEXT DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) to insert contact requests
DROP POLICY IF EXISTS "Public can insert contact inquiries" ON contact_inquiries;
CREATE POLICY "Public can insert contact inquiries" ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow viewing and managing contact inquiries
DROP POLICY IF EXISTS "Admin can view contact inquiries" ON contact_inquiries;
CREATE POLICY "Admin can view contact inquiries" ON contact_inquiries
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can update contact inquiries" ON contact_inquiries;
CREATE POLICY "Admin can update contact inquiries" ON contact_inquiries
  FOR UPDATE
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can delete contact inquiries" ON contact_inquiries;
CREATE POLICY "Admin can delete contact inquiries" ON contact_inquiries
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);

-- 2. Admin Login Attempts Table (for distributed rate limiting)
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip TEXT NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert admin login attempts" ON admin_login_attempts;
CREATE POLICY "Public can insert admin login attempts" ON admin_login_attempts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select admin login attempts" ON admin_login_attempts;
CREATE POLICY "Public can select admin login attempts" ON admin_login_attempts
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can delete admin login attempts" ON admin_login_attempts;
CREATE POLICY "Public can delete admin login attempts" ON admin_login_attempts
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip_time ON admin_login_attempts(ip, attempted_at DESC);
