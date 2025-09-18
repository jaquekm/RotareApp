import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [RoutesService, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [RoutesController],
})
export class RoutesModule {}
