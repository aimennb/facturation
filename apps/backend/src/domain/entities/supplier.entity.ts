import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "./base.entity.js";
import { Invoice } from "./invoice.entity.js";
import { Payment } from "./payment.entity.js";
import { SupplierAdvance } from "./supplier-advance.entity.js";

@Entity({ name: "suppliers" })
export class Supplier extends BaseEntity {
  @Column({ type: "text", name: "display_name" })
  displayName!: string;

  @Column({ type: "text", nullable: true })
  brand?: string | null;

  @Column({ type: "text", name: "contact_phone", nullable: true })
  contactPhone?: string | null;

  @Column({ type: "text", nullable: true })
  address?: string | null;

  @Column({ type: "bigint", name: "balance_cents", default: 0 })
  balanceCents!: number;

  @OneToMany(() => Invoice, (invoice) => invoice.supplier)
  invoices?: Invoice[];

  @OneToMany(() => SupplierAdvance, (advance) => advance.supplier)
  advances?: SupplierAdvance[];

  @OneToMany(() => Payment, (payment) => payment.supplier)
  payments?: Payment[];
}
