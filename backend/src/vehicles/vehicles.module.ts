import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [VehiclesService, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
