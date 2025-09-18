import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { JwtAuthGuard } from './jwt.guard';
import { Roles, RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) { return this.auth.signup(dto); }

  @Post('login')
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Post('refresh')
  refresh(@Body('refresh_token') refresh_token: string) { return this.auth.refresh(refresh_token); }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) { return { user: req.user }; }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('company_admin')
  @Get('admin-check')
  adminCheck() { return { ok: true }; }
}
