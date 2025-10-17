import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

import { BaseEntity } from './base.entity.js';
import { Supplier } from './supplier.entity.js';
import { Customer } from './customer.entity.js';
import { User } from './user.entity.js';
import { InvoiceItem } from './invoice-item.entity.js';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
  @Column({ type: 'int' })
  seq!: number;

  @Index({ unique: true })
  @Column({ type: 'text' })
  number!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'text', name: 'delivered_to', nullable: true })
  deliveredTo?: string | null;

  @Column({ type: 'text', nullable: true })
  brand?: string | null;

  @Column({ type: 'text', nullable: true })
  packaging?: string | null;

  @Column({ type: 'text', nullable: true })
  consignment?: string | null;

  @Column({ type: 'text', nullable: true })
  carreau?: string | null;

  @Column({ type: 'uuid', name: 'supplier_id', nullable: true })
  supplierId?: string | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.invoices, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier | null;

  @Column({ type: 'uuid', name: 'customer_id', nullable: true })
  customerId?: string | null;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer | null;

  @Column({ type: 'text', name: 'currency_code', default: 'DZD' })
  currencyCode!: string;

  @Column({ type: 'bigint', name: 'total_cents', default: 0 })
  totalCents!: number;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdById?: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items?: InvoiceItem[];
}
