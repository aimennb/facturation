import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1700000000000 implements MigrationInterface {
  name = "InitSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS company_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      market_name TEXT,
      carreau_no TEXT,
      address TEXT,
      phone TEXT,
      logo_url TEXT,
      invoice_prefix TEXT DEFAULT 'N°',
      invoice_padding INT DEFAULT 6,
      currency_code TEXT DEFAULT 'DZD',
      footer_note TEXT DEFAULT 'Après huit (8) jours, l’emballage ne sera pas remboursé.',
      locale_default TEXT DEFAULT 'fr',
      timezone TEXT DEFAULT 'Africa/Algiers',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS suppliers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      display_name TEXT NOT NULL,
      brand TEXT,
      contact_phone TEXT,
      address TEXT,
      balance_cents BIGINT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      display_name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      unit TEXT DEFAULT 'kg',
      default_price_cents BIGINT,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      role TEXT CHECK (role IN ('ADMIN','VENDEUR','FOURNISSEUR')) NOT NULL,
      supplier_id UUID REFERENCES suppliers(id),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      seq INT NOT NULL,
      number TEXT NOT NULL UNIQUE,
      date DATE NOT NULL,
      delivered_to TEXT,
      brand TEXT,
      packaging TEXT,
      consignment TEXT,
      carreau TEXT,
      supplier_id UUID REFERENCES suppliers(id),
      customer_id UUID REFERENCES customers(id),
      currency_code TEXT DEFAULT 'DZD',
      total_cents BIGINT DEFAULT 0,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS invoice_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id),
      marque TEXT,
      colis_count INT,
      weight_brut DECIMAL(10,3),
      weight_tare DECIMAL(10,3),
      weight_net DECIMAL(10,3),
      unit_price_cents BIGINT,
      amount_cents BIGINT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS supplier_advances (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      supplier_id UUID REFERENCES suppliers(id),
      date DATE NOT NULL,
      reference TEXT,
      amount_cents BIGINT NOT NULL,
      note TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      supplier_id UUID REFERENCES suppliers(id),
      invoice_id UUID REFERENCES invoices(id),
      date DATE NOT NULL,
      amount_cents BIGINT NOT NULL,
      method TEXT,
      note TEXT
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id),
      action TEXT,
      entity TEXT,
      entity_id UUID,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS audit_logs");
    await queryRunner.query("DROP TABLE IF EXISTS payments");
    await queryRunner.query("DROP TABLE IF EXISTS supplier_advances");
    await queryRunner.query("DROP TABLE IF EXISTS invoice_items");
    await queryRunner.query("DROP TABLE IF EXISTS invoices");
    await queryRunner.query("DROP TABLE IF EXISTS users");
    await queryRunner.query("DROP TABLE IF EXISTS products");
    await queryRunner.query("DROP TABLE IF EXISTS customers");
    await queryRunner.query("DROP TABLE IF EXISTS suppliers");
    await queryRunner.query("DROP TABLE IF EXISTS company_settings");
  }
}
