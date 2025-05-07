import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // Thay bằng biến môi trường trong thực tế
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JwtStrategy.validate - payload:', payload);
    const user = await this.usersService.findOne(payload.sub);
    return { _id: user._id, email: user.email, role: user.role };
  }
}