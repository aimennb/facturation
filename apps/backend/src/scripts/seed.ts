import * as argon2 from "argon2";

import { AppDataSource } from '../data-source.js';
import { CompanySettings } from '../domain/entities/company-settings.entity.js';
import { Supplier } from '../domain/entities/supplier.entity.js';
import { Product } from '../domain/entities/product.entity.js';
import { User } from '../domain/entities/user.entity.js';
import { Invoice } from '../domain/entities/invoice.entity.js';
import { InvoiceItem } from '../domain/entities/invoice-item.entity.js';

async function seed() {
  await AppDataSource.initialize();
  const manager = AppDataSource.manager;

  const existingSettings = await manager.findOne(CompanySettings, {});
  if (!existingSettings) {
    const settings = manager.create(CompanySettings, {
      name: 'Khenouci Chabane',
      marketName: 'Mandataire fruits & légumes',
      carreauNo: '62',
      address: 'Marché de gros Eucalyptus',
      phone: '+213 555 555 555'
    });
    await manager.save(settings);
  }

  const suppliers = await manager.find(Supplier);
  if (suppliers.length === 0) {
    const supplierEntries = [
      { displayName: 'Sarl Zeralda Primeurs', brand: 'ZP' },
      { displayName: 'Ferhani Import', brand: 'FI' }
    ];
    for (const entry of supplierEntries) {
      const supplier = manager.create(Supplier, entry);
      await manager.save(supplier);
    }
  }

  const products = await manager.find(Product);
  if (products.length === 0) {
    const productEntries = [
      { name: 'Tomate', defaultPriceCents: 2500 },
      { name: 'Pomme de terre', defaultPriceCents: 1200 },
      { name: 'Courgette', defaultPriceCents: 3000 }
    ];
    for (const entry of productEntries) {
      const product = manager.create(Product, entry);
      await manager.save(product);
    }
  }

  const users = await manager.find(User);
  if (users.length === 0) {
    const password = await argon2.hash('Password123!');
    const supplierUser = await manager.findOneBy(Supplier, { brand: 'FI' });
    const admin = manager.create(User, {
      email: 'admin@example.com',
      passwordHash: password,
      role: 'ADMIN',
      fullName: 'Admin'
    });
    const seller = manager.create(User, {
      email: 'vendeur@example.com',
      passwordHash: password,
      role: 'VENDEUR',
      fullName: 'Vendeur Démo'
    });
    const portal = manager.create(User, {
      email: 'fournisseur@example.com',
      passwordHash: password,
      role: 'FOURNISSEUR',
      fullName: 'Portail Fournisseur',
      supplierId: supplierUser?.id
    });
    await manager.save([admin, seller, portal]);
  }

  const invoiceExists = await manager.findOneBy(Invoice, { number: '0000001' });
  if (!invoiceExists) {
    const supplier = await manager.findOneBy(Supplier, { brand: 'ZP' });
    const seller = await manager.findOneBy(User, { role: 'VENDEUR' });
    const productsList = await manager.find(Product);
    const invoice = manager.create(Invoice, {
      seq: 1,
      number: '0000001',
      date: new Date().toISOString().substring(0, 10),
      deliveredTo: 'Sarl Zeralda Primeurs',
      brand: supplier?.brand,
      packaging: 'Caisse',
      consignment: 'Oui',
      carreau: '12',
      supplierId: supplier?.id,
      createdById: seller?.id
    });
    await manager.save(invoice);

    let seq = 0;
    for (const product of productsList.slice(0, 3)) {
      const brut = 100 + seq * 10;
      const tare = 5;
      const net = brut - tare;
      const unitPrice = (product.defaultPriceCents ?? 1000) / 100;
      const item = manager.create(InvoiceItem, {
        invoiceId: invoice.id,
        productId: product.id,
        marque: supplier?.brand,
        colisCount: 10 + seq,
        weightBrut: brut.toFixed(3),
        weightTare: tare.toFixed(3),
        weightNet: net.toFixed(3),
        unitPriceCents: product.defaultPriceCents ?? 1000,
        amountCents: Math.round(net * unitPrice * 100)
      });
      await manager.save(item);
      seq += 1;
    }

    const items = await manager.findBy(InvoiceItem, { invoiceId: invoice.id });
    invoice.totalCents = items.reduce((sum, item) => sum + Number(item.amountCents), 0);
    await manager.save(invoice);
  }

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
