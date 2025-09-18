-- ENABLE ROW LEVEL SECURITY nas tabelas multi-empresa
-- Policies ..._company_isolation usando current_setting('app.company_id', true)::uuid

ALTER TABLE vehicles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops         ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops   ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_events   ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='vehicles_company_isolation') THEN
    CREATE POLICY vehicles_company_isolation ON vehicles
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='routes_company_isolation') THEN
    CREATE POLICY routes_company_isolation ON routes
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='stops_company_isolation') THEN
    CREATE POLICY stops_company_isolation ON stops
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='route_stops_company_isolation') THEN
    CREATE POLICY route_stops_company_isolation ON route_stops
      USING (
        (SELECT company_id FROM routes WHERE routes.id = route_stops.route_id)
        = current_setting('app.company_id', true)::uuid
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='trips_company_isolation') THEN
    CREATE POLICY trips_company_isolation ON trips
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='tickets_company_isolation') THEN
    CREATE POLICY tickets_company_isolation ON tickets
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='positions_company_isolation') THEN
    CREATE POLICY positions_company_isolation ON positions
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname='trip_events_company_isolation') THEN
    CREATE POLICY trip_events_company_isolation ON trip_events
      USING (company_id = current_setting('app.company_id', true)::uuid);
  END IF;
END $$;
