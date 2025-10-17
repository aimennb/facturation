import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateCompanySettingsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  marketName?: string;

  @IsOptional()
  @IsString()
  carreauNo?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  invoicePrefix?: string;

  @IsOptional()
  @IsInt()
  @Min(3)
  invoicePadding?: number;

  @IsOptional()
  @IsString()
  currencyCode?: string;

  @IsOptional()
  @IsString()
  footerNote?: string;

  @IsOptional()
  @IsString()
  localeDefault?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
