import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class InvoiceItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  marque?: string;

  @IsInt()
  @Min(0)
  colisCount!: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  weightBrut!: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  weightTare!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
