import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateAdvanceDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsNumber()
  @Min(0)
  amountCents!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
