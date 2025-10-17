import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity.js';

@Entity({ name: 'company_settings' })
export class CompanySettings extends BaseEntity {
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true, name: 'market_name' })
  marketName?: string | null;

  @Column({ type: 'text', nullable: true, name: 'carreau_no' })
  carreauNo?: string | null;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @Column({ type: 'text', nullable: true })
  phone?: string | null;

  @Column({ type: 'text', nullable: true, name: 'logo_url' })
  logoUrl?: string | null;

  @Column({ type: 'text', name: 'invoice_prefix', default: 'N°' })
  invoicePrefix!: string;

  @Column({ type: 'int', name: 'invoice_padding', default: 6 })
  invoicePadding!: number;

  @Column({ type: 'text', name: 'currency_code', default: 'DZD' })
  currencyCode!: string;

  @Column({ type: 'text', name: 'footer_note', default: "Après huit (8) jours, l’emballage ne sera pas remboursé." })
  footerNote!: string;

  @Column({ type: 'text', name: 'locale_default', default: 'fr' })
  localeDefault!: string;

  @Column({ type: 'text', default: 'Africa/Algiers' })
  timezone!: string;
}
