import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [TicketsService, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [TicketsController],
})
export class TicketsModule {}
