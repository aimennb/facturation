import "reflect-metadata";
import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import { databaseConfig } from "./config/database.config.js";
import { AuditLog } from "./domain/entities/audit-log.entity.js";
import { CompanySettings } from "./domain/entities/company-settings.entity.js";
import { Customer } from "./domain/entities/customer.entity.js";
import { Invoice } from "./domain/entities/invoice.entity.js";
import { InvoiceItem } from "./domain/entities/invoice-item.entity.js";
import { Payment } from "./domain/entities/payment.entity.js";
import { Product } from "./domain/entities/product.entity.js";
import { Supplier } from "./domain/entities/supplier.entity.js";
import { SupplierAdvance } from "./domain/entities/supplier-advance.entity.js";
import { User } from "./domain/entities/user.entity.js";

const databaseOptions = databaseConfig() as DataSourceOptions;

export const AppDataSource = new DataSource({
  ...databaseOptions,
  entities: [
    CompanySettings,
    User,
    Supplier,
    Customer,
    Product,
    Invoice,
    InvoiceItem,
    SupplierAdvance,
    Payment,
    AuditLog,
  ],
  migrations: ["dist/src/migrations/*.js"],
});
