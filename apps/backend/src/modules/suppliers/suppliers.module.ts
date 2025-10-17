import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Supplier } from '../../domain/entities/supplier.entity.js';
import { Invoice } from '../../domain/entities/invoice.entity.js';
import { SupplierAdvance } from '../../domain/entities/supplier-advance.entity.js';
import { Payment } from '../../domain/entities/payment.entity.js';
import { SuppliersService } from './suppliers.service.js';
import { SuppliersController } from './suppliers.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Invoice, SupplierAdvance, Payment])],
  providers: [SuppliersService],
  controllers: [SuppliersController],
  exports: [SuppliersService]
})
export class SuppliersModule {}
