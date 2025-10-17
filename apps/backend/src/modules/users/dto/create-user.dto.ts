import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsEnum(["ADMIN", "VENDEUR", "FOURNISSEUR"])
  role!: "ADMIN" | "VENDEUR" | "FOURNISSEUR";

  @IsOptional()
  @IsString()
  supplierId?: string;
}
