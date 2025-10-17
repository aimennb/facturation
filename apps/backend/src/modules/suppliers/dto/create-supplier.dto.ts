import { IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
