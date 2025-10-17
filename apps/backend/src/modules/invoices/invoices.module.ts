import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InvoicesController } from "./invoices.controller.js";
import { InvoicesService } from "./invoices.service.js";
import { AuditModule } from "../audit/audit.module.js";
import { SettingsModule } from "../settings/settings.module.js";
import { InvoiceItem } from "../../domain/entities/invoice-item.entity.js";
import { Invoice } from "../../domain/entities/invoice.entity.js";
import { Product } from "../../domain/entities/product.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem, Product, Supplier]),
    SettingsModule,
    AuditModule,
  ],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
