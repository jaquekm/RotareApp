import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: async () => {
        const pool = new Pool({
          host: process.env.DB_HOST || 'postgres',
          port: Number(process.env.DB_PORT || 5432),
          user: process.env.DB_USER || 'rotare_user',
          password: process.env.DB_PASSWORD || 'rotare_pass',
          database: process.env.DB_NAME || 'rotare',
          max: 10,
        });
        return pool;
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DbModule {}
