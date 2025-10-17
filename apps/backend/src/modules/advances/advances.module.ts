import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AdvancesController } from "./advances.controller.js";
import { AdvancesService } from "./advances.service.js";
import { AuditModule } from "../audit/audit.module.js";
import { SupplierAdvance } from "../../domain/entities/supplier-advance.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([SupplierAdvance, Supplier]), AuditModule],
  providers: [AdvancesService],
  controllers: [AdvancesController],
  exports: [AdvancesService],
})
export class AdvancesModule {}
