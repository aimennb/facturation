import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

import { BaseEntity } from "./base.entity.js";
import { Invoice } from "./invoice.entity.js";
import { Product } from "./product.entity.js";

@Entity({ name: "invoice_items" })
export class InvoiceItem extends BaseEntity {
  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "invoice_id" })
  invoice!: Invoice;

  @RelationId((item: InvoiceItem) => item.invoice)
  @Column({ type: "uuid", name: "invoice_id" })
  invoiceId!: string;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product?: Product | null;

  @Column({ type: "uuid", name: "product_id", nullable: true })
  productId?: string | null;

  @Column({ type: "text", nullable: true })
  marque?: string | null;

  @Column({ type: "int", name: "colis_count", default: 0 })
  colisCount!: number;

  @Column({
    type: "decimal",
    name: "weight_brut",
    precision: 10,
    scale: 3,
    default: 0,
  })
  weightBrut!: string;

  @Column({
    type: "decimal",
    name: "weight_tare",
    precision: 10,
    scale: 3,
    default: 0,
  })
  weightTare!: string;

  @Column({
    type: "decimal",
    name: "weight_net",
    precision: 10,
    scale: 3,
    default: 0,
  })
  weightNet!: string;

  @Column({ type: "bigint", name: "unit_price_cents", default: 0 })
  unitPriceCents!: number;

  @Column({ type: "bigint", name: "amount_cents", default: 0 })
  amountCents!: number;
}
