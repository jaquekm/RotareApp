import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { TelemetryGateway } from './telemetry.gateway';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [
    TelemetryService,
    TelemetryGateway,
    // Mapeia o token 'PG_POOL' para injeção por tipo Pool
    { provide: Pool, useExisting: 'PG_POOL' },
  ],
  controllers: [TelemetryController],
})
export class TelemetryModule {}
