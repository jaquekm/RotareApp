DROP MATERIALIZED VIEW IF EXISTS latest_vehicle_position;
CREATE MATERIALIZED VIEW latest_vehicle_position AS
SELECT DISTINCT ON (vehicle_id)
  vehicle_id, company_id, trip_id, ts, geom, speed_kmh, heading_deg
FROM positions
ORDER BY vehicle_id, ts DESC;

CREATE UNIQUE INDEX IF NOT EXISTS latest_vehicle_position_vehicle_uidx
  ON latest_vehicle_position (vehicle_id);
