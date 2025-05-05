import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService, RegisterDto } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
    const requiredFields = ['name', 'email', 'password', 'address', 'phone', 'delivery_address'];
    const missingFields = requiredFields.filter((field) => !user[field]);
    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Vui lòng cung cấp đầy đủ thông tin: ${missingFields.join(', ')}`,
      );
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