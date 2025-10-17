import { Controller, Get, UseGuards } from '@nestjs/common';

import { Roles } from '../../common/roles.decorator.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AuditService } from './audit.service.js';

@Controller({ path: 'audit', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll() {
    return this.auditService.findAll();
  }
}
