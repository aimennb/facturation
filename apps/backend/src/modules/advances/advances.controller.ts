import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdvancesService } from "./advances.service.js";
import { CreateAdvanceDto } from "./dto/create-advance.dto.js";
import { Roles } from "../../common/roles.decorator.js";
import { RolesGuard } from "../../common/roles.guard.js";

@Controller({ path: "", version: "1" })
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdvancesController {
  constructor(private readonly advancesService: AdvancesService) {}

  @Post("suppliers/:id/advances")
  @Roles("ADMIN", "VENDEUR")
  create(@Param("id") supplierId: string, @Body() payload: CreateAdvanceDto) {
    return this.advancesService.create(supplierId, payload);
  }

  @Get("suppliers/:id/advances")
  @Roles("ADMIN", "VENDEUR", "FOURNISSEUR")
  findAll(@Param("id") supplierId: string) {
    return this.advancesService.findBySupplier(supplierId);
  }

  @Delete("advances/:advanceId")
  @Roles("ADMIN")
  remove(@Param("advanceId") advanceId: string) {
    return this.advancesService.remove(advanceId);
  }
}
