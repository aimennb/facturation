import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from '../../domain/entities/audit-log.entity.js';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>
  ) {}

  async log(action: string, entity: string, entityId: string | null, details?: Record<string, unknown>, userId?: string) {
    const log = this.auditRepository.create({
      action,
      entity,
      entityId: entityId ?? undefined,
      details,
      userId
    });
    await this.auditRepository.save(log);
  }

  findAll() {
    return this.auditRepository.find({ order: { createdAt: 'DESC' }, take: 200 });
  }
}
