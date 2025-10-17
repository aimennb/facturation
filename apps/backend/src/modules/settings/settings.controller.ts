import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";

import { Roles } from "../../common/roles.decorator.js";
import { RolesGuard } from "../../common/roles.guard.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { SettingsService } from "./settings.service.js";
import { UpdateCompanySettingsDto } from "./dto/update-company-settings.dto.js";
import { UpdateNumberingDto } from "./dto/update-numbering.dto.js";

@Controller({ path: "settings", version: "1" })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("company")
  getCompany() {
    return this.settingsService.getCompany();
  }

  @Patch("company")
  updateCompany(@Body() payload: UpdateCompanySettingsDto) {
    return this.settingsService.updateCompany(payload);
  }

  @Get("numbering")
  getNumbering() {
    return this.settingsService.getNumbering();
  }

  @Patch("numbering")
  updateNumbering(@Body() payload: UpdateNumberingDto) {
    return this.settingsService.updateNumbering(payload);
  }
}
