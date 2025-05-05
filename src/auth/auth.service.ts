import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: string;
  address: string;
  phone: string;
  avatar?: string;
  delivery_address: string;
  is_active?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterDto): Promise<any> {
    const newUser = await this.usersService.create({
      ...user,
      role: user.role || 'user',
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    const { password, ...result } = newUser;
    return result;
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}