import { Controller, Get, Param, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly svc: TelemetryService) {}

  @Get('vehicle/:id/latest')
  async latest(@Param('id') vehicleId: string) {
    if (!vehicleId) throw new BadRequestException('vehicle id requerido');
    return this.svc.getLatestPosition(vehicleId);
  }

  @Get('trip/:id/track')
  async track(
    @Param('id') tripId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 6 * 60 * 60 * 1000); // padrão: 6h
    const toDate = to ? new Date(to) : new Date();
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException('from/to inválidos (use ISO-8601)');
    }
    // janela máxima 24h
    if (toDate.getTime() - fromDate.getTime() > 24 * 60 * 60 * 1000) {
      throw new BadRequestException('janela máxima de 24h');
    }
    const rows = await this.svc.getTripTrack(tripId, fromDate, toDate);
    // resposta GeoJSON FeatureCollection
    return {
      type: 'FeatureCollection',
      features: rows.map((r: any) => ({
        type: 'Feature',
        geometry: r.geom, // já em JSON (ST_AsGeoJSON::json) se você ajustar o SELECT
        properties: { ts: r.ts, speed_kmh: r.speed_kmh, heading_deg: r.heading_deg }
      }))
    };
  }
}
