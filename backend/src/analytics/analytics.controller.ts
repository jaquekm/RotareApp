import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('vehicle-usage')
  async vehicleUsage() {
    return this.analyticsService.getVehicleUsage();
  }

  @Get('trip-stats')
  async tripStats() {
    return this.analyticsService.getTripStats();
  }
}
