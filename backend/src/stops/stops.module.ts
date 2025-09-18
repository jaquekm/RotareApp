import { Module } from '@nestjs/common';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [StopsService, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [StopsController],
})
export class StopsModule {}
