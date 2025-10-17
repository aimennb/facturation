import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { TokenPayload } from './interfaces/token-payload.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload: TokenPayload = {
      sub: user.id,
      role: user.role,
      email: user.email
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt').accessToken.secret,
        expiresIn: this.configService.get('jwt').accessToken.expiresIn
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt').refreshToken.secret,
        expiresIn: this.configService.get('jwt').refreshToken.expiresIn
      }),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        supplierId: user.supplierId
      }
    };
  }

  async refresh(payload: TokenPayload) {
    const user = await this.usersService.findOne(payload.sub);
    const newPayload: TokenPayload = {
      sub: user.id,
      role: user.role,
      email: user.email
    };

    return {
      accessToken: await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get('jwt').accessToken.secret,
        expiresIn: this.configService.get('jwt').accessToken.expiresIn
      })
    };
  }
}
