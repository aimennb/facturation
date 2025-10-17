import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateAdvanceDto } from "./dto/create-advance.dto.js";
import { AuditService } from "../audit/audit.service.js";
import { SupplierAdvance } from "../../domain/entities/supplier-advance.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";

@Injectable()
export class AdvancesService {
  constructor(
    @InjectRepository(SupplierAdvance)
    private readonly advancesRepository: Repository<SupplierAdvance>,
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    private readonly auditService: AuditService,
  ) {}

  async create(supplierId: string, payload: CreateAdvanceDto, userId?: string) {
    const supplier = await this.suppliersRepository.findOne({
      where: { id: supplierId },
    });
    if (!supplier) {
      throw new NotFoundException("Supplier not found");
    }
    const advance = this.advancesRepository.create({
      supplierId,
      date: payload.date,
      reference: payload.reference,
      amountCents: payload.amountCents,
      note: payload.note,
      createdById: userId,
    });
    const saved = await this.advancesRepository.save(advance);
    const details: Record<string, unknown> = {
      supplierId,
      date: payload.date,
      reference: payload.reference,
      amountCents: payload.amountCents,
      note: payload.note,
    };
    await this.auditService.log(
      "advance.created",
      "SupplierAdvance",
      saved.id,
      details,
      userId,
    );
    return saved;
  }

  async findBySupplier(supplierId: string) {
    return this.advancesRepository.find({
      where: { supplierId },
      order: { date: "DESC", createdAt: "DESC" },
    });
  }

  async remove(id: string, userId?: string) {
    const advance = await this.advancesRepository.findOne({ where: { id } });
    if (!advance) {
      throw new NotFoundException("Advance not found");
    }
    await this.advancesRepository.delete(id);
    await this.auditService.log(
      "advance.deleted",
      "SupplierAdvance",
      id,
      undefined,
      userId,
    );
    return { success: true };
  }
}
