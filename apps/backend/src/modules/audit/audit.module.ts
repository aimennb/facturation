import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuditService } from "./audit.service.js";
import { AuditController } from "./audit.controller.js";
import { AuditLog } from "../../domain/entities/audit-log.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
