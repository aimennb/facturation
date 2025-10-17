import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  supplierId!: string;

  @IsOptional()
  @IsString()
  invoiceId?: string;

  @IsDateString()
  date!: string;

  @IsNumber()
  @Min(0)
  amountCents!: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
