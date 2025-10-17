import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanySettings } from '../../domain/entities/company-settings.entity.js';
import { SettingsService } from './settings.service.js';
import { SettingsController } from './settings.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CompanySettings])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService]
})
export class SettingsModule {}
