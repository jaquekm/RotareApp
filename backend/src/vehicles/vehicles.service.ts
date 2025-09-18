import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class VehiclesService {
  constructor(private readonly pool: Pool) {}

  async findAll() {
    const res = await this.pool.query('SELECT * FROM vehicles');
    return res.rows;
  }

  async findOne(id: string) {
    const res = await this.pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return res.rows[0];
  }

  async create(data: any) {
    const res = await this.pool.query('INSERT INTO vehicles (company_id, code, plate, metadata) VALUES ($1, $2, $3, $4) RETURNING *', [data.company_id, data.code, data.plate, data.metadata]);
    return res.rows[0];
  }

  async update(id: string, data: any) {
    const res = await this.pool.query('UPDATE vehicles SET code = $1, plate = $2, metadata = $3 WHERE id = $4 RETURNING *', [data.code, data.plate, data.metadata, id]);
    return res.rows[0];
  }

  async remove(id: string) {
    await this.pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    return { deleted: true };
  }
}
