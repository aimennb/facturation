import { renderInvoiceHtml } from "./invoice-template.js";
import { Invoice } from "../../../domain/entities/invoice.entity.js";
import { CompanySettings } from "../../../domain/entities/company-settings.entity.js";

describe("renderInvoiceHtml", () => {
  const invoice = {
    number: "0001",
    date: "2024-02-01",
    deliveredTo: "Client",
    brand: "Brand",
    packaging: "Caisse",
    consignment: "Oui",
    carreau: "12",
    currencyCode: "DZD",
    totalCents: 12345,
    items: [
      {
        marque: "Marque",
        colisCount: 10,
        product: { name: "Tomate" },
      },
    ],
  } as unknown as Invoice;
  const settings = {
    name: "Entreprise",
    marketName: "Marché",
    address: "Adresse",
    phone: "0555",
    carreauNo: "12",
  } as CompanySettings;

  it("renders bilingual headers", () => {
    const html = renderInvoiceHtml(invoice, settings, { locale: "fr" });
    expect(html).toContain("BULLETIN D’ACHAT");
    expect(html).toContain("بيان الشراء");
  });

  it("includes totals formatted as currency", () => {
    const html = renderInvoiceHtml(invoice, settings, { locale: "fr" });
    expect(html).toContain("12 3");
  });

  it("supports RTL rendering", () => {
    const html = renderInvoiceHtml(invoice, settings, { locale: "ar" });
    expect(html).toContain("dir=\"rtl\"");
  });
});
