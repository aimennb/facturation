import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice } from '../../domain/entities/invoice.entity.js';
import { InvoiceItem } from '../../domain/entities/invoice-item.entity.js';
import { Product } from '../../domain/entities/product.entity.js';
import { Supplier } from '../../domain/entities/supplier.entity.js';
import { InvoicesService } from './invoices.service.js';
import { InvoicesController } from './invoices.controller.js';
import { SettingsModule } from '../settings/settings.module.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem, Product, Supplier]),
    SettingsModule,
    AuditModule
  ],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService]
})
export class InvoicesModule {}
