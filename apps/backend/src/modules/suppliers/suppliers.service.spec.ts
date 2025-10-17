import { NotFoundException } from '@nestjs/common';

import { SuppliersService } from './suppliers.service.js';

const createRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findOneBy: jest.fn()
});

const createInvoiceRepo = () => ({ find: jest.fn() });
const createAdvanceRepo = () => ({ find: jest.fn() });
const createPaymentRepo = () => ({ find: jest.fn() });

describe('SuppliersService', () => {
  let service: SuppliersService;
  const supplierRepo = createRepo();
  const invoiceRepo = createInvoiceRepo();
  const advanceRepo = createAdvanceRepo();
  const paymentRepo = createPaymentRepo();

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SuppliersService(
      supplierRepo as any,
      invoiceRepo as any,
      advanceRepo as any,
      paymentRepo as any
    );
  });

  it('calculates balance from invoices, payments and advances', async () => {
    supplierRepo.findOne.mockResolvedValue({ id: 's1' });
    invoiceRepo.find.mockResolvedValue([{ totalCents: 1000 }, { totalCents: 2000 }]);
    paymentRepo.find.mockResolvedValue([{ amountCents: 500 }]);
    advanceRepo.find.mockResolvedValue([{ amountCents: 300 }]);

    const result = await service.getBalance('s1');
    expect(result.balanceCents).toBe(2200);
  });

  it('throws when supplier missing on balance', async () => {
    supplierRepo.findOne.mockResolvedValue(null);
    await expect(service.getBalance('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns ledger with related collections', async () => {
    supplierRepo.findOne.mockResolvedValue({ id: 's1', displayName: 'Demo' });
    invoiceRepo.find.mockResolvedValue([{ id: 'inv1' }]);
    paymentRepo.find.mockResolvedValue([{ id: 'pay1' }]);
    advanceRepo.find.mockResolvedValue([{ id: 'adv1' }]);
    supplierRepo.findOne.mockResolvedValueOnce({ id: 's1', displayName: 'Demo' });

    const ledger = await service.getLedger('s1');
    expect(ledger.invoices).toHaveLength(1);
    expect(ledger.payments).toHaveLength(1);
    expect(ledger.advances).toHaveLength(1);
  });

  it('updates supplier with partial payload', async () => {
    supplierRepo.findOne.mockResolvedValue({ id: 's1', displayName: 'Old' });
    supplierRepo.save.mockImplementation((value: unknown) => value);

    const updated = await service.update('s1', { displayName: 'New' });
    expect(updated.displayName).toBe('New');
  });

  it('throws on remove missing supplier', async () => {
    supplierRepo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
