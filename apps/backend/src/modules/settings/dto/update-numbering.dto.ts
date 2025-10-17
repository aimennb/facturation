import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateNumberingDto {
  @IsOptional()
  @IsString()
  invoicePrefix?: string;

  @IsOptional()
  @IsInt()
  @Min(3)
  invoicePadding?: number;

  @IsOptional()
  @IsBoolean()
  resetAnnually?: boolean;
}
