import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { TelemetryGateway } from './telemetry.gateway';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly pool: Pool,
    private readonly telemetryGateway: TelemetryGateway,
  ) {}

  async getLatestPosition(vehicleId: string) {
    const res = await this.pool.query(
      `SELECT * FROM latest_vehicle_position WHERE vehicle_id = $1`,
      [vehicleId],
    );
    return res.rows[0] || null;
  }

  async getTripTrack(tripId: string, fromDate: Date, toDate: Date) {
    const res = await this.pool.query(
      `SELECT ts, speed_kmh, heading_deg, ST_AsGeoJSON(geom)::json AS geom
       FROM positions
       WHERE trip_id = $1 AND ts BETWEEN $2 AND $3
       ORDER BY ts ASC`,
      [tripId, fromDate, toDate],
    );
    return res.rows;
  }

  publishPosition(tripId: string, position: any) {
    this.telemetryGateway.broadcastPosition(tripId, position);
  }
}
