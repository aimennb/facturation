import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { BaseEntity } from "./base.entity.js";
import { Invoice } from "./invoice.entity.js";
import { Supplier } from "./supplier.entity.js";

@Entity({ name: "payments" })
export class Payment extends BaseEntity {
  @ManyToOne(() => Supplier, (supplier) => supplier.payments)
  @JoinColumn({ name: "supplier_id" })
  supplier!: Supplier;

  @Column({ type: "uuid", name: "supplier_id" })
  supplierId!: string;

  @ManyToOne(() => Invoice, { nullable: true })
  @JoinColumn({ name: "invoice_id" })
  invoice?: Invoice | null;

  @Column({ type: "uuid", name: "invoice_id", nullable: true })
  invoiceId?: string | null;

  @Column({ type: "date" })
  date!: string;

  @Column({ type: "bigint", name: "amount_cents" })
  amountCents!: number;

  @Column({ type: "text", nullable: true })
  method?: string | null;

  @Column({ type: "text", nullable: true })
  note?: string | null;
}
