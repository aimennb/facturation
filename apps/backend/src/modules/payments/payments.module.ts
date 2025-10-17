import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PaymentsController } from "./payments.controller.js";
import { PaymentsService } from "./payments.service.js";
import { AuditModule } from "../audit/audit.module.js";
import { Invoice } from "../../domain/entities/invoice.entity.js";
import { Payment } from "../../domain/entities/payment.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Supplier, Invoice]),
    AuditModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
