import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { StopsService } from './stops.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  findAll() {
    return this.stopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stopsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.stopsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.stopsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stopsService.remove(id);
  }
}
