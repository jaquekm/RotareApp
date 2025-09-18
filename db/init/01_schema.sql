-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Multi-tenant base (companies)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','company_admin','operator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  plate TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(company_id, code)
);

-- Routes (geometry as LINESTRING)
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geom geometry(LINESTRING, 4326) NOT NULL
);
CREATE INDEX IF NOT EXISTS routes_geom_gix ON routes USING GIST (geom);

-- Stops (POINT)
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geom geometry(POINT, 4326) NOT NULL
);
CREATE INDEX IF NOT EXISTS stops_geom_gix ON stops USING GIST (geom);

-- Route stops order
CREATE TABLE IF NOT EXISTS route_stops (
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES stops(id) ON DELETE CASCADE,
  seq INT NOT NULL,
  PRIMARY KEY(route_id, stop_id),
  UNIQUE(route_id, seq)
);

-- Trips (scheduled instances of a route)
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  planned_start TIMESTAMPTZ NOT NULL,
  planned_end   TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','running','finished','canceled'))
);

-- Tickets (passenger link to trip)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, ticket_number)
);

-- Positions (telemetry points) - POINT + attributes
CREATE TABLE IF NOT EXISTS positions (
  id BIGSERIAL PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  ts TIMESTAMPTZ NOT NULL,
  geom geometry(POINT, 4326) NOT NULL,
  speed_kmh NUMERIC,
  heading_deg NUMERIC
);
CREATE INDEX IF NOT EXISTS positions_geom_gix ON positions USING GIST (geom);
CREATE INDEX IF NOT EXISTS positions_ts_brix ON positions USING BRIN (ts);
CREATE INDEX IF NOT EXISTS positions_vehicle_ts_idx ON positions (vehicle_id, ts DESC);

-- Latest position per vehicle (materialized view)
CREATE MATERIALIZED VIEW IF NOT EXISTS latest_vehicle_position AS
SELECT DISTINCT ON (vehicle_id)
  vehicle_id, company_id, trip_id, ts, geom, speed_kmh, heading_deg
FROM positions
ORDER BY vehicle_id, ts DESC;

-- Simple function to upsert latest position (refresh fast path)
CREATE OR REPLACE FUNCTION refresh_latest_vehicle_position() RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY latest_vehicle_position;
  RETURN NULL;
END
$$ LANGUAGE plpgsql;

-- Optional trigger to refresh view periodically via cron/external
