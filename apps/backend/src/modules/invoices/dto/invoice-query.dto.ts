import { IsDateString, IsOptional, IsString } from 'class-validator';

export class InvoiceQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  supplier?: string;
}
