import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { InvoicesController } from '../src/modules/invoices/invoices.controller.js';
import { InvoicesService } from '../src/modules/invoices/invoices.service.js';
import { JwtAuthGuard } from '../src/modules/auth/jwt-auth.guard.js';
import { RolesGuard } from '../src/common/roles.guard.js';

describe('InvoicesController (e2e)', () => {
  let app;
  const invoicesService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', number: '0001' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', number: '0001' }),
    create: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1', brand: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ success: true }),
    addItem: jest.fn().mockResolvedValue({ id: '1' }),
    updateItem: jest.fn().mockResolvedValue({ id: '1' }),
    removeItem: jest.fn().mockResolvedValue({ id: '1' }),
    generatePdf: jest.fn().mockResolvedValue(Buffer.from('pdf'))
  } as unknown as InvoicesService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [{ provide: InvoicesService, useValue: invoicesService }]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/invoices returns list', async () => {
    const response = await request(app.getHttpServer()).get('/api/invoices');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('GET /api/invoices/:id returns invoice', async () => {
    const response = await request(app.getHttpServer()).get('/api/invoices/1');
    expect(response.status).toBe(200);
    expect(response.body.number).toBe('0001');
  });

  it('POST /api/invoices creates invoice', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/invoices')
      .send({ items: [{ weightBrut: 10, weightTare: 5, unitPrice: 100, colisCount: 1 }] });
    expect(response.status).toBe(201);
  });

  it('PATCH /api/invoices/:id updates invoice', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/invoices/1')
      .send({ brand: 'Updated' });
    expect(response.status).toBe(200);
    expect(response.body.brand).toBe('Updated');
  });

  it('DELETE /api/invoices/:id removes invoice', async () => {
    const response = await request(app.getHttpServer()).delete('/api/invoices/1');
    expect(response.status).toBe(200);
  });
});
