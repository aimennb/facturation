import { Column, Entity, Index, ManyToOne, JoinColumn } from "typeorm";

import { BaseEntity } from "./base.entity.js";
import { Supplier } from "./supplier.entity.js";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: "text" })
  email!: string;

  @Column({ type: "text", name: "password_hash" })
  passwordHash!: string;

  @Column({ type: "text", name: "full_name", nullable: true })
  fullName?: string | null;

  @Column({ type: "text" })
  role!: "ADMIN" | "VENDEUR" | "FOURNISSEUR";

  @Column({ type: "uuid", name: "supplier_id", nullable: true })
  supplierId?: string | null;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "supplier_id" })
  supplier?: Supplier | null;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive!: boolean;
}
