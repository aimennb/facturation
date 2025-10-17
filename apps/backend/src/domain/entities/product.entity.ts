import { Column, Entity } from "typeorm";

import { BaseEntity } from "./base.entity.js";

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", default: "kg" })
  unit!: string;

  @Column({ type: "bigint", name: "default_price_cents", nullable: true })
  defaultPriceCents?: number | null;
}
