import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '../../infra/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  getToken(@Query('userId') userId: string) {
    const token = this.authService.generateToken(userId || 'test-user');
    return { token };
  }
}