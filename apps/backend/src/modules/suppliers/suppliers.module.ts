import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SuppliersController } from "./suppliers.controller.js";
import { SuppliersService } from "./suppliers.service.js";
import { Invoice } from "../../domain/entities/invoice.entity.js";
import { Payment } from "../../domain/entities/payment.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";
import { SupplierAdvance } from "../../domain/entities/supplier-advance.entity.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Invoice, SupplierAdvance, Payment]),
  ],
  providers: [SuppliersService],
  controllers: [SuppliersController],
  exports: [SuppliersService],
})
export class SuppliersModule {}
