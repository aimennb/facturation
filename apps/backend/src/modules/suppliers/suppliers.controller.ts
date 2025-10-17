import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "../../common/roles.decorator.js";
import { RolesGuard } from "../../common/roles.guard.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { SuppliersService } from "./suppliers.service.js";
import { CreateSupplierDto } from "./dto/create-supplier.dto.js";
import { UpdateSupplierDto } from "./dto/update-supplier.dto.js";

@Controller({ path: "suppliers", version: "1" })
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Roles("ADMIN", "VENDEUR")
  create(@Body() payload: CreateSupplierDto) {
    return this.suppliersService.create(payload);
  }

  @Get()
  @Roles("ADMIN", "VENDEUR")
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(":id")
  @Roles("ADMIN", "VENDEUR", "FOURNISSEUR")
  findOne(@Param("id") id: string) {
    return this.suppliersService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "VENDEUR")
  update(@Param("id") id: string, @Body() payload: UpdateSupplierDto) {
    return this.suppliersService.update(id, payload);
  }

  @Delete(":id")
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.suppliersService.remove(id);
  }

  @Get(":id/balance")
  @Roles("ADMIN", "VENDEUR", "FOURNISSEUR")
  balance(@Param("id") id: string) {
    return this.suppliersService.getBalance(id);
  }

  @Get(":id/ledger")
  @Roles("ADMIN", "VENDEUR", "FOURNISSEUR")
  ledger(@Param("id") id: string) {
    return this.suppliersService.getLedger(id);
  }
}
