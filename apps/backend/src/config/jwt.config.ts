import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessToken: {
    secret: process.env.JWT_SECRET ?? 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '3600s'
  },
  refreshToken: {
    secret: process.env.REFRESH_SECRET ?? 'refresh',
    expiresIn: process.env.REFRESH_EXPIRES_IN ?? '7d'
  }
}));
