import { BadRequestException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import { Invoice } from "../../domain/entities/invoice.entity.js";
import { InvoiceItem } from "../../domain/entities/invoice-item.entity.js";
import { Product } from "../../domain/entities/product.entity.js";
import { Supplier } from "../../domain/entities/supplier.entity.js";
import { AuditService } from "../audit/audit.service.js";
import { SettingsService } from "../settings/settings.service.js";
import { InvoiceItemDto } from "./dto/invoice-item.dto.js";
import { InvoicesService } from "./invoices.service.js";

const createRepo = <T>() => ({
  createQueryBuilder: jest.fn(),
  manager: {},
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
}) satisfies Partial<Repository<T>>;

describe("InvoicesService helpers", () => {
  const invoiceRepo = createRepo<Invoice>();
  const itemRepo = createRepo<InvoiceItem>();
  const productRepo = createRepo<Product>();
  const supplierRepo = createRepo<Supplier>();
  const dataSource = {
    createQueryRunner: jest.fn(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        create: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getRawOne: jest.fn().mockResolvedValue({ seq: 0 }),
        })),
      },
    })),
  } as unknown as DataSource;
  const settingsService = {
    getCompany: jest
      .fn()
      .mockResolvedValue({ invoicePadding: 6, carreauNo: "12" }),
    getNumbering: jest.fn().mockResolvedValue({ resetAnnually: false }),
  } satisfies Pick<SettingsService, "getCompany" | "getNumbering">;
  const auditService = { log: jest.fn() } satisfies Pick<AuditService, "log">;
  const service = new InvoicesService(
    invoiceRepo as unknown as Repository<Invoice>,
    itemRepo as unknown as Repository<InvoiceItem>,
    productRepo as unknown as Repository<Product>,
    supplierRepo as unknown as Repository<Supplier>,
    dataSource as DataSource,
    settingsService as SettingsService,
    auditService as AuditService,
  );

  it("computes net and amount from item dto", () => {
    const computeItemAmounts = Reflect.get(
      service,
      "computeItemAmounts",
    ) as (item: InvoiceItemDto) => { net: number; amountCents: number };
    const result = computeItemAmounts({
      weightBrut: 10,
      weightTare: 2,
      unitPrice: 100,
      colisCount: 1,
    });
    expect(result.net).toBe(8);
    expect(result.amountCents).toBe(80000);
  });

  it("throws when tare exceeds brut", () => {
    const computeItemAmounts = Reflect.get(
      service,
      "computeItemAmounts",
    ) as (item: InvoiceItemDto) => unknown;
    expect(() =>
      computeItemAmounts({
        weightBrut: 1,
        weightTare: 2,
        unitPrice: 10,
        colisCount: 1,
      }),
    ).toThrow(BadRequestException);
  });

  it("generates padded numbers", async () => {
    const queryRunner = dataSource.createQueryRunner();
    const generateIdentifiers = Reflect.get(
      service,
      "generateIdentifiers",
    ) as (
      manager: ReturnType<typeof dataSource.createQueryRunner>["manager"],
      invoiceDate: string,
    ) => Promise<{ seq: number; number: string; settings: unknown }>;
    const { seq, number } = await generateIdentifiers(
      queryRunner.manager,
      "2024-02-01",
    );
    expect(seq).toBe(1);
    expect(number).toBe("000001");
  });

  it("maps item entity with computed net", () => {
    const queryRunner = dataSource.createQueryRunner();
    const invoice = { id: "inv1" } as unknown as Invoice;
    const mapItemEntity = Reflect.get(service, "mapItemEntity") as (
      item: InvoiceItemDto,
      invoiceValue: Invoice,
      manager: typeof queryRunner.manager,
    ) => InvoiceItem;
    const entity = mapItemEntity(
      {
        weightBrut: 10,
        weightTare: 2,
        unitPrice: 50,
        colisCount: 3,
      },
      invoice,
      queryRunner.manager,
    );
    expect(entity.weightNet).toBe("8.000");
    expect(entity.amountCents).toBe(40000);
  });
});
