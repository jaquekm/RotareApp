-- Minimal seed data
INSERT INTO companies (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001','Rotare Demo Co')
ON CONFLICT DO NOTHING;

-- demo admin user (password: admin123 - hash must be set by API on signup in real env)
-- This seed only creates the user email; set password via API for security.
INSERT INTO users (id, company_id, email, password_hash, role)
VALUES ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','admin@demo.rotare', '$2b$10$WQG1x2bXlE1c8Wn4n4YAjO8w3Y0G.0O9C6WJ6v/2c8Xf0N5o0kz7a', 'company_admin')
ON CONFLICT DO NOTHING;

-- vehicles
INSERT INTO vehicles (company_id, code, plate) VALUES
  ('00000000-0000-0000-0000-000000000001', 'BUS-100', 'ABC1D23')
ON CONFLICT DO NOTHING;
