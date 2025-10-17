import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuditLog } from "../../domain/entities/audit-log.entity.js";
import { AuditService } from "./audit.service.js";
import { AuditController } from "./audit.controller.js";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
