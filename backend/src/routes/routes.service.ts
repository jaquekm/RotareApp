import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RoutesService {
  constructor(private readonly pool: Pool) {}

  async findAll() {
    const res = await this.pool.query('SELECT id, company_id, name, ST_AsGeoJSON(geom)::json as geom FROM routes');
    return res.rows;
  }

  async findOne(id: string) {
    const res = await this.pool.query('SELECT id, company_id, name, ST_AsGeoJSON(geom)::json as geom FROM routes WHERE id = $1', [id]);
    return res.rows[0];
  }

  async create(data: any) {
    const res = await this.pool.query('INSERT INTO routes (company_id, name, geom) VALUES ($1, $2, ST_GeomFromText($3, 4326)) RETURNING id, company_id, name, ST_AsGeoJSON(geom)::json as geom', [data.company_id, data.name, data.geom]);
    return res.rows[0];
  }

  async update(id: string, data: any) {
    const res = await this.pool.query('UPDATE routes SET name = $1, geom = ST_GeomFromText($2, 4326) WHERE id = $3 RETURNING id, company_id, name, ST_AsGeoJSON(geom)::json as geom', [data.name, data.geom, id]);
    return res.rows[0];
  }

  async remove(id: string) {
    await this.pool.query('DELETE FROM routes WHERE id = $1', [id]);
    return { deleted: true };
  }
}
