import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignupDto, LoginDto, Role } from './dto';

type UserRow = { id: string; email: string; password_hash: string; company_id: string | null; role: Role };

@Injectable()
export class AuthService {
  constructor(private readonly pool: Pool) {}

  private signTokens(payload: any) {
    const access = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '15m' });
    const refresh = jwt.sign(
      { sub: payload.sub, company_id: payload.company_id, role: payload.role },
      process.env.JWT_REFRESH_SECRET || 'dev-refresh',
      { expiresIn: '30d' }
    );
    return { access_token: access, refresh_token: refresh };
  }

  async signup(dto: SignupDto) {
    const { email, password, company_id = null, role = 'user' } = dto;
    const hash = await bcrypt.hash(password, 10);
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const exists = await client.query('SELECT 1 FROM users WHERE email = $1', [email]);
      if (exists.rowCount) throw new ConflictException('Email já cadastrado');
      const ins = await client.query<UserRow>(
        `INSERT INTO users (email, password_hash, role, company_id)
         VALUES ($1,$2,$3,$4)
         RETURNING id, email, password_hash, company_id, role`,
        [email, hash, role, company_id]
      );
      const u = ins.rows[0];
      await client.query('COMMIT');
      const tokens = this.signTokens({ sub: u.id, email: u.email, company_id: u.company_id, role: u.role });
      return { user: { id: u.id, email: u.email, company_id: u.company_id, role: u.role }, ...tokens };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const res = await this.pool.query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
    if (!res.rowCount) throw new UnauthorizedException('Credenciais inválidas');
    const u = res.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    const tokens = this.signTokens({ sub: u.id, email: u.email, company_id: u.company_id, role: u.role });
    return { user: { id: u.id, email: u.email, company_id: u.company_id, role: u.role }, ...tokens };
  }

  async refresh(refresh_token: string) {
    try {
      const decoded: any = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET || 'dev-refresh');
      const res = await this.pool.query<UserRow>('SELECT id, email, company_id, role FROM users WHERE id = $1', [decoded.sub]);
      if (!res.rowCount) throw new UnauthorizedException('Token inválido');
      const u = res.rows[0];
      const tokens = this.signTokens({ sub: u.id, email: u.email, company_id: u.company_id, role: u.role });
      return { user: u, ...tokens };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
