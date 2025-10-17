import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreatePaymentDto } from "./dto/create-payment.dto.js";
import { AuditService } from "../audit/audit.service.js";
import { Invoice } from "../../domain/entities/invoice.entity.js";
import { Payment } from "../../domain/entities/payment.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    private readonly auditService: AuditService,
  ) {}

  async create(payload: CreatePaymentDto, userId?: string) {
    const supplier = await this.suppliersRepository.findOne({
      where: { id: payload.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException("Supplier not found");
    }
    if (payload.invoiceId) {
      const invoice = await this.invoicesRepository.findOne({
        where: { id: payload.invoiceId },
      });
      if (!invoice) {
        throw new NotFoundException("Invoice not found");
      }
    }
    const payment = this.paymentsRepository.create(payload);
    const saved = await this.paymentsRepository.save(payment);
    const details: Record<string, unknown> = {
      supplierId: payload.supplierId,
      invoiceId: payload.invoiceId,
      amountCents: payload.amountCents,
      date: payload.date,
      method: payload.method,
      note: payload.note,
    };
    await this.auditService.log(
      "payment.created",
      "Payment",
      saved.id,
      details,
      userId,
    );
    return saved;
  }

  findAll() {
    return this.paymentsRepository.find({ order: { date: "DESC" } });
  }

  async remove(id: string, userId?: string) {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
    await this.paymentsRepository.delete(id);
    await this.auditService.log(
      "payment.deleted",
      "Payment",
      id,
      undefined,
      userId,
    );
    return { success: true };
  }
}
