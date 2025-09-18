import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { CompanyScopeMiddleware } from '../common/company-scope.middleware';
import { DbModule } from '../common/db.module';
import { Pool } from 'pg';

@Module({
  imports: [DbModule],
  providers: [AuthService, JwtAuthGuard, RolesGuard, { provide: Pool, useExisting: 'PG_POOL' }],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompanyScopeMiddleware).forRoutes('*');
  }
}
