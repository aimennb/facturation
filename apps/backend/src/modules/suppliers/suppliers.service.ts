import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Supplier } from "../../domain/entities/supplier.entity.js";
import { Invoice } from "../../domain/entities/invoice.entity.js";
import { SupplierAdvance } from "../../domain/entities/supplier-advance.entity.js";
import { Payment } from "../../domain/entities/payment.entity.js";
import { CreateSupplierDto } from "./dto/create-supplier.dto.js";
import { UpdateSupplierDto } from "./dto/update-supplier.dto.js";

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(SupplierAdvance)
    private readonly advancesRepository: Repository<SupplierAdvance>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  create(payload: CreateSupplierDto) {
    const supplier = this.supplierRepository.create(payload);
    return this.supplierRepository.save(supplier);
  }

  findAll() {
    return this.supplierRepository.find({ order: { displayName: "ASC" } });
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException("Supplier not found");
    }
    return supplier;
  }

  async update(id: string, payload: UpdateSupplierDto) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, payload);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: string) {
    const result = await this.supplierRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException("Supplier not found");
    }
  }

  async getBalance(id: string) {
    await this.findOne(id);
    const invoices = await this.invoicesRepository.find({
      where: { supplierId: id },
    });
    const payments = await this.paymentsRepository.find({
      where: { supplierId: id },
    });
    const advances = await this.advancesRepository.find({
      where: { supplierId: id },
    });

    const invoiceTotal = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalCents),
      0,
    );
    const paymentsTotal = payments.reduce(
      (sum, payment) => sum + Number(payment.amountCents),
      0,
    );
    const advancesTotal = advances.reduce(
      (sum, advance) => sum + Number(advance.amountCents),
      0,
    );

    const balanceCents = invoiceTotal - paymentsTotal - advancesTotal;

    return { balanceCents };
  }

  async getLedger(id: string) {
    const supplier = await this.findOne(id);
    const invoices = await this.invoicesRepository.find({
      where: { supplierId: id },
      order: { date: "ASC", seq: "ASC" },
      relations: ["items"],
    });
    const payments = await this.paymentsRepository.find({
      where: { supplierId: id },
      order: { date: "ASC" },
    });
    const advances = await this.advancesRepository.find({
      where: { supplierId: id },
      order: { date: "ASC" },
    });

    const balance = await this.getBalance(id);

    return {
      supplier,
      invoices,
      payments,
      advances,
      balance,
    };
  }
}
