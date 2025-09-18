import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Pool, PoolClient } from 'pg';

declare module 'express-serve-static-core' {
  interface Request {
    pgClient?: PoolClient;
    user?: any;
  }
}

@Injectable()
export class CompanyScopeMiddleware implements NestMiddleware {
  constructor(private readonly pool: Pool) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const client = await this.pool.connect();
    req.pgClient = client;
    const companyId = (req as any).user?.company_id;
    try {
      if (companyId) {
        await client.query('SET app.company_id = $1', [companyId]);
      } else {
        await client.query('SET app.company_id TO DEFAULT');
      }
    } catch {}
    res.on('finish', () => client.release());
    next();
  }
}
