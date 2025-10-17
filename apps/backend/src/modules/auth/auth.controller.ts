import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { RefreshDto } from "./dto/refresh.dto.js";
import { TokenPayload } from "./interfaces/token-payload.js";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt-refresh"))
  refresh(@Req() req: Request, @Body() _body: RefreshDto) {
    const payload = req.user as TokenPayload;
    return this.authService.refresh(payload);
  }

  @Post("logout")
  logout() {
    return { success: true };
  }
}
