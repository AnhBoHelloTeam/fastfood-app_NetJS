import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: any) {
    if (!user.email || !user.password || !user.name) {
      throw new BadRequestException('Vui lòng cung cấp email, mật khẩu và tên');
    }
    return this.authService.register(user);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Vui lòng cung cấp email và mật khẩu');
    }
    return this.authService.login(body.email, body.password);
  }
}