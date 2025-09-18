import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [AnalyticsService, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
