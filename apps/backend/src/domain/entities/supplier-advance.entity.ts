import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity.js';
import { Supplier } from './supplier.entity.js';
import { User } from './user.entity.js';

@Entity({ name: 'supplier_advances' })
export class SupplierAdvance extends BaseEntity {
  @ManyToOne(() => Supplier, (supplier) => supplier.advances)
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'text', nullable: true })
  reference?: string | null;

  @Column({ type: 'bigint', name: 'amount_cents' })
  amountCents!: number;

  @Column({ type: 'text', nullable: true })
  note?: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdById?: string | null;
}
