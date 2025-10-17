import { Column, Entity } from "typeorm";

import { BaseEntity } from "./base.entity.js";

@Entity({ name: "customers" })
export class Customer extends BaseEntity {
  @Column({ type: "text", name: "display_name" })
  displayName!: string;

  @Column({ type: "text", nullable: true })
  phone?: string | null;

  @Column({ type: "text", nullable: true })
  address?: string | null;
}
