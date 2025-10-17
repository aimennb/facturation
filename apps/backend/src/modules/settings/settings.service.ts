import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UpdateCompanySettingsDto } from "./dto/update-company-settings.dto.js";
import { UpdateNumberingDto } from "./dto/update-numbering.dto.js";
import { CompanySettings } from "../../domain/entities/company-settings.entity.js";

@Injectable()
export class SettingsService {
  private resetAnnually = false;

  constructor(
    @InjectRepository(CompanySettings)
    private readonly settingsRepository: Repository<CompanySettings>,
  ) {}

  async getCompany(): Promise<CompanySettings> {
    let settings = await this.settingsRepository.findOne({});
    if (!settings) {
      settings = this.settingsRepository.create({
        name: "Khenouci Chabane",
        marketName: "Mandataire fruits & légumes",
        carreauNo: "1",
        footerNote: "Après huit (8) jours, l’emballage ne sera pas remboursé.",
      });
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async updateCompany(payload: UpdateCompanySettingsDto) {
    const settings = await this.getCompany();
    Object.assign(settings, payload);
    return this.settingsRepository.save(settings);
  }

  async getNumbering() {
    const settings = await this.getCompany();
    return {
      invoicePrefix: settings.invoicePrefix,
      invoicePadding: settings.invoicePadding,
      resetAnnually: this.resetAnnually,
    };
  }

  async updateNumbering(payload: UpdateNumberingDto) {
    const settings = await this.getCompany();
    if (payload.invoicePrefix) {
      settings.invoicePrefix = payload.invoicePrefix;
    }
    if (payload.invoicePadding) {
      settings.invoicePadding = payload.invoicePadding;
    }
    if (payload.resetAnnually !== undefined) {
      this.resetAnnually = payload.resetAnnually;
    }
    await this.settingsRepository.save(settings);
    return this.getNumbering();
  }
}
