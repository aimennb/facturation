import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { formatISO } from 'date-fns';
import * as puppeteer from 'puppeteer';

import { Invoice } from '../../domain/entities/invoice.entity.js';
import { InvoiceItem } from '../../domain/entities/invoice-item.entity.js';
import { Product } from '../../domain/entities/product.entity.js';
import { Supplier } from '../../domain/entities/supplier.entity.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
import { InvoiceQueryDto } from './dto/invoice-query.dto.js';
import { InvoiceItemDto } from './dto/invoice-item.dto.js';
import { SettingsService } from '../settings/settings.service.js';
import { AuditService } from '../audit/audit.service.js';
import { renderInvoiceHtml } from './pdf/invoice-template.js';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly itemsRepository: Repository<InvoiceItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    private readonly dataSource: DataSource,
    private readonly settingsService: SettingsService,
    private readonly auditService: AuditService
  ) {}

  private ensureWeights(item: InvoiceItemDto) {
    if (item.weightBrut < item.weightTare) {
      throw new BadRequestException('Brut weight must be greater than or equal to tare');
    }
  }

  private computeItemAmounts(item: InvoiceItemDto) {
    this.ensureWeights(item);
    const net = Number((item.weightBrut - item.weightTare).toFixed(3));
    const amountCents = Math.round(net * item.unitPrice * 100);
    return { net, amountCents };
  }

  private async generateIdentifiers(manager: EntityManager, invoiceDate: string) {
    const settings = await this.settingsService.getCompany();
    const numbering = await this.settingsService.getNumbering();
    const query = manager
      .createQueryBuilder(Invoice, 'invoice')
      .select('invoice.seq', 'seq')
      .orderBy('invoice.seq', 'DESC')
      .limit(1)
      .setLock('pessimistic_write');

    if (numbering.resetAnnually) {
      const year = invoiceDate.substring(0, 4);
      query.where('EXTRACT(YEAR FROM invoice.date) = :year', { year });
    }

    const latest = await query.getRawOne<{ seq?: number }>();
    const nextSeq = (latest?.seq ?? 0) + 1;
    const number = String(nextSeq).padStart(settings.invoicePadding, '0');

    return { seq: nextSeq, number, settings };
  }

  private mapItemEntity(itemDto: InvoiceItemDto, invoice: Invoice, manager: EntityManager) {
    const { net, amountCents } = this.computeItemAmounts(itemDto);
    const entity = manager.create(InvoiceItem, {
      invoice,
      productId: itemDto.productId,
      marque: itemDto.marque,
      colisCount: itemDto.colisCount,
      weightBrut: itemDto.weightBrut.toFixed(3),
      weightTare: itemDto.weightTare.toFixed(3),
      weightNet: net.toFixed(3),
      unitPriceCents: Math.round(itemDto.unitPrice * 100),
      amountCents
    });
    return entity;
  }

  async create(createInvoiceDto: CreateInvoiceDto, userId?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const date = createInvoiceDto.date ?? formatISO(new Date(), { representation: 'date' });
      const { seq, number, settings } = await this.generateIdentifiers(queryRunner.manager, date);

      const invoice = queryRunner.manager.create(Invoice, {
        seq,
        number,
        date,
        deliveredTo: createInvoiceDto.deliveredTo,
        brand: createInvoiceDto.brand,
        packaging: createInvoiceDto.packaging,
        consignment: createInvoiceDto.consignment,
        carreau: createInvoiceDto.carreau ?? settings.carreauNo,
        supplierId: createInvoiceDto.supplierId,
        customerId: createInvoiceDto.customerId,
        createdById: userId
      });

      const items = createInvoiceDto.items.map((item) => this.mapItemEntity(item, invoice, queryRunner.manager));
      invoice.items = items;
      invoice.totalCents = items.reduce((sum, item) => sum + Number(item.amountCents), 0);

      const saved = await queryRunner.manager.save(invoice);
      await this.auditService.log('invoice.created', 'Invoice', saved.id, { number: saved.number }, userId);

      await queryRunner.commitTransaction();

      return this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: InvoiceQueryDto) {
    const qb = this.invoicesRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('invoice.supplier', 'supplier')
      .orderBy('invoice.date', 'DESC')
      .addOrderBy('invoice.seq', 'DESC');

    if (query.from) {
      qb.andWhere('invoice.date >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('invoice.date <= :to', { to: query.to });
    }

    if (query.q) {
      qb.andWhere(
        '(LOWER(invoice.number) LIKE :q OR LOWER(invoice.deliveredTo) LIKE :q OR LOWER(invoice.brand) LIKE :q)',
        { q: `%${query.q.toLowerCase()}%` }
      );
    }

    if (query.supplier) {
      qb.andWhere('invoice.supplierId = :supplier', { supplier: query.supplier });
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'supplier', 'createdBy']
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async update(id: string, payload: UpdateInvoiceDto, userId?: string) {
    const invoice = await this.findOne(id);
    if (payload.date) {
      invoice.date = payload.date;
    }
    if (payload.deliveredTo !== undefined) invoice.deliveredTo = payload.deliveredTo;
    if (payload.brand !== undefined) invoice.brand = payload.brand;
    if (payload.packaging !== undefined) invoice.packaging = payload.packaging;
    if (payload.consignment !== undefined) invoice.consignment = payload.consignment;
    if (payload.carreau !== undefined) invoice.carreau = payload.carreau;
    if (payload.supplierId !== undefined) invoice.supplierId = payload.supplierId;
    if (payload.customerId !== undefined) invoice.customerId = payload.customerId;

    await this.invoicesRepository.save(invoice);
    await this.auditService.log('invoice.updated', 'Invoice', invoice.id, payload, userId);
    return this.findOne(id);
  }

  async remove(id: string, userId?: string) {
    const invoice = await this.findOne(id);
    await this.invoicesRepository.delete(invoice.id);
    await this.auditService.log('invoice.deleted', 'Invoice', invoice.id, { number: invoice.number }, userId);
    return { success: true };
  }

  async addItem(invoiceId: string, itemDto: InvoiceItemDto, userId?: string) {
    const invoice = await this.findOne(invoiceId);
    const manager = this.invoicesRepository.manager;
    const item = this.mapItemEntity(itemDto, invoice, manager);
    await this.itemsRepository.save(item);
    await this.recalculateTotals(invoiceId, manager);
    await this.auditService.log('invoice.item.added', 'Invoice', invoiceId, itemDto as any, userId);
    return this.findOne(invoiceId);
  }

  async updateItem(itemId: string, itemDto: InvoiceItemDto, userId?: string) {
    const item = await this.itemsRepository.findOne({ where: { id: itemId }, relations: ['invoice'] });
    if (!item) {
      throw new NotFoundException('Invoice item not found');
    }
    this.ensureWeights(itemDto);
    const { net, amountCents } = this.computeItemAmounts(itemDto);
    item.productId = itemDto.productId;
    item.marque = itemDto.marque;
    item.colisCount = itemDto.colisCount;
    item.weightBrut = itemDto.weightBrut.toFixed(3);
    item.weightTare = itemDto.weightTare.toFixed(3);
    item.weightNet = net.toFixed(3);
    item.unitPriceCents = Math.round(itemDto.unitPrice * 100);
    item.amountCents = amountCents;
    await this.itemsRepository.save(item);
    await this.recalculateTotals(item.invoiceId, this.itemsRepository.manager);
    await this.auditService.log('invoice.item.updated', 'Invoice', item.invoiceId, itemDto as any, userId);
    return this.findOne(item.invoiceId);
  }

  async removeItem(itemId: string, userId?: string) {
    const item = await this.itemsRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Invoice item not found');
    }
    const invoiceId = item.invoiceId;
    await this.itemsRepository.delete(itemId);
    await this.recalculateTotals(invoiceId, this.itemsRepository.manager);
    await this.auditService.log('invoice.item.deleted', 'Invoice', invoiceId, { itemId }, userId);
    return this.findOne(invoiceId);
  }

  private async recalculateTotals(invoiceId: string, manager: EntityManager) {
    const invoice = await manager.findOneOrFail(Invoice, { where: { id: invoiceId }, relations: ['items'] });
    const total = invoice.items.reduce((sum, item) => sum + Number(item.amountCents), 0);
    invoice.totalCents = total;
    await manager.save(invoice);
  }

  async generatePdf(id: string, locale: 'fr' | 'ar' = 'fr') {
    const invoice = await this.findOne(id);
    const settings = await this.settingsService.getCompany();

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
    const page = await browser.newPage();
    const html = renderInvoiceHtml(invoice, settings, { locale });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A5', landscape: true, printBackground: true });
    await browser.close();
    await this.auditService.log('invoice.pdf.generated', 'Invoice', invoice.id, { locale }, invoice.createdById ?? undefined);
    return pdfBuffer;
  }
}
