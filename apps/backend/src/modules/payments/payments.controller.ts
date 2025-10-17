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
import { PaymentsService } from "./payments.service.js";
import { CreatePaymentDto } from "./dto/create-payment.dto.js";
import { Roles } from "../../common/roles.decorator.js";
import { RolesGuard } from "../../common/roles.guard.js";

@Controller({ path: "payments", version: "1" })
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles("ADMIN", "VENDEUR")
  create(@Body() payload: CreatePaymentDto) {
    return this.paymentsService.create(payload);
  }

  @Get()
  @Roles("ADMIN", "VENDEUR")
  findAll() {
    return this.paymentsService.findAll();
  }

  @Delete(":id")
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.paymentsService.remove(id);
  }
}
