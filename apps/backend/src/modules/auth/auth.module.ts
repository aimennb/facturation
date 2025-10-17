import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { RefreshJwtStrategy } from "./strategies/refresh.strategy.js";
import { UsersModule } from "../users/users.module.js";

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
