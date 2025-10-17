import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { TokenPayload } from "../interfaces/token-payload.js";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt").refreshToken.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("Missing refresh token");
    }
    return { ...payload, refreshToken };
  }
}
