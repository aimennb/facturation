import { SettingsService } from './settings.service.js';

const createRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(() => ({}))
});

describe('SettingsService', () => {
  const repo = createRepo();
  let service: SettingsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SettingsService(repo as any);
  });

  it('initializes company settings when missing', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    repo.save.mockImplementation((value: unknown) => value);
    await service.getCompany();
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('updates numbering data', async () => {
    repo.findOne.mockResolvedValue({ invoicePrefix: 'N°', invoicePadding: 6 });
    const result = await service.updateNumbering({ invoicePrefix: 'INV', invoicePadding: 8, resetAnnually: true });
    expect(result.invoicePrefix).toBe('INV');
    expect(result.resetAnnually).toBe(true);
  });

  it('returns company settings without recreation', async () => {
    repo.findOne.mockResolvedValue({ name: 'Company' });
    const settings = await service.getCompany();
    expect(settings.name).toBe('Company');
  });
});
