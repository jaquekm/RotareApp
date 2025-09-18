import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [TripsService, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [TripsController],
})
export class TripsModule {}
