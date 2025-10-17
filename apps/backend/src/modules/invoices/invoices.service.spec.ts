import { BadRequestException } from '@nestjs/common';

import { InvoicesService } from './invoices.service.js';

const createRepo = () => ({
  createQueryBuilder: jest.fn(),
  manager: {},
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn()
});

describe('InvoicesService helpers', () => {
  const invoiceRepo = createRepo();
  const itemRepo = createRepo();
  const productRepo = createRepo();
  const supplierRepo = createRepo();
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
          getRawOne: jest.fn().mockResolvedValue({ seq: 0 })
        }))
      }
    }))
  };
  const settingsService = {
    getCompany: jest.fn().mockResolvedValue({ invoicePadding: 6, carreauNo: '12' }),
    getNumbering: jest.fn().mockResolvedValue({ resetAnnually: false })
  };
  const auditService = { log: jest.fn() };
  const service = new InvoicesService(
    invoiceRepo as any,
    itemRepo as any,
    productRepo as any,
    supplierRepo as any,
    dataSource as any,
    settingsService as any,
    auditService as any
  );

  it('computes net and amount from item dto', () => {
    const result = (service as any).computeItemAmounts({
      weightBrut: 10,
      weightTare: 2,
      unitPrice: 100,
      colisCount: 1
    });
    expect(result.net).toBe(8);
    expect(result.amountCents).toBe(80000);
  });

  it('throws when tare exceeds brut', () => {
    expect(() => (service as any).computeItemAmounts({
      weightBrut: 1,
      weightTare: 2,
      unitPrice: 10,
      colisCount: 1
    })).toThrow(BadRequestException);
  });

  it('generates padded numbers', async () => {
    const queryRunner = dataSource.createQueryRunner();
    const { seq, number } = await (service as any).generateIdentifiers(queryRunner.manager, '2024-02-01');
    expect(seq).toBe(1);
    expect(number).toBe('000001');
  });

  it('maps item entity with computed net', () => {
    const queryRunner = dataSource.createQueryRunner();
    const invoice = { id: 'inv1' };
    const entity = (service as any).mapItemEntity(
      {
        weightBrut: 10,
        weightTare: 2,
        unitPrice: 50,
        colisCount: 3
      },
      invoice,
      queryRunner.manager
    );
    expect(entity.weightNet).toBe('8.000');
    expect(entity.amountCents).toBe(40000);
  });
});
