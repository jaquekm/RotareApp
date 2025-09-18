import { Module } from '@nestjs/common';
import { DbModule } from './common/db.module';
import { AuthModule } from './auth/auth.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TripsModule } from './trips/trips.module';
import { RoutesModule } from './routes/routes.module';
import { StopsModule } from './stops/stops.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TicketsModule } from './tickets/tickets.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    TelemetryModule,
    TripsModule,
    RoutesModule,
    StopsModule,
    VehiclesModule,
    TicketsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
