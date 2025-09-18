import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TicketsService {
  constructor(private readonly pool: Pool) {}

  async findAll() {
    const res = await this.pool.query('SELECT * FROM tickets');
    return res.rows;
  }

  async findOne(id: string) {
    const res = await this.pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    return res.rows[0];
  }

  async create(data: any) {
    const res = await this.pool.query('INSERT INTO tickets (company_id, trip_id, ticket_number, user_id) VALUES ($1, $2, $3, $4) RETURNING *', [data.company_id, data.trip_id, data.ticket_number, data.user_id]);
    return res.rows[0];
  }

  async update(id: string, data: any) {
    const res = await this.pool.query('UPDATE tickets SET ticket_number = $1, user_id = $2 WHERE id = $3 RETURNING *', [data.ticket_number, data.user_id, id]);
    return res.rows[0];
  }

  async remove(id: string) {
    await this.pool.query('DELETE FROM tickets WHERE id = $1', [id]);
    return { deleted: true };
  }
}
