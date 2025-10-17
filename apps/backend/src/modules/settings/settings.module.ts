import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SettingsController } from "./settings.controller.js";
import { SettingsService } from "./settings.service.js";
import { CompanySettings } from "../../domain/entities/company-settings.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([CompanySettings])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
