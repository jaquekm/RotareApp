import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TripsService {
  constructor(private readonly pool: Pool) {}

  async findAll() {
    const res = await this.pool.query('SELECT * FROM trips');
    return res.rows;
  }

  async findOne(id: string) {
    const res = await this.pool.query('SELECT * FROM trips WHERE id = $1', [id]);
    return res.rows[0];
  }

  async getEta(tripId: string) {
    // Stub: calculate ETA to next stop
    // In real, get current position, find next stop on route, calculate distance/speed
    return { eta: 15 }; // minutes
  }

  async create(data: any) {
    const res = await this.pool.query('INSERT INTO trips (company_id, route_id, vehicle_id, planned_start, planned_end, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [data.company_id, data.route_id, data.vehicle_id, data.planned_start, data.planned_end, data.status]);
    return res.rows[0];
  }

  async update(id: string, data: any) {
    const res = await this.pool.query('UPDATE trips SET status = $1 WHERE id = $2 RETURNING *', [data.status, id]);
    return res.rows[0];
  }

  async remove(id: string) {
    await this.pool.query('DELETE FROM trips WHERE id = $1', [id]);
    return { deleted: true };
  }
}
