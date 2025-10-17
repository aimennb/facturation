import { Invoice } from "../../../domain/entities/invoice.entity.js";
import { CompanySettings } from "../../../domain/entities/company-settings.entity.js";

interface RenderOptions {
  locale: "fr" | "ar";
}

const translate = {
  title: {
    fr: "BULLETIN D’ACHAT",
    ar: "بيان الشراء",
  },
  deliveredTo: {
    fr: "Délivré à",
    ar: "إلى السيد",
  },
  brand: {
    fr: "Marque",
    ar: "الأصل",
  },
  packaging: {
    fr: "Emb.",
    ar: "التغليف",
  },
  consignment: {
    fr: "Consignation",
    ar: "الضمان",
  },
  carreau: {
    fr: "Carreau",
    ar: "كاررو",
  },
  date: {
    fr: "Date",
    ar: "التاريخ",
  },
  number: {
    fr: "N°",
    ar: "الرقم",
  },
  marque: {
    fr: "Marque",
    ar: "الأصل",
  },
  colis: {
    fr: "N. colis",
    ar: "عدد الطلبيات",
  },
  product: {
    fr: "Nature des produits",
    ar: "طبيعة المواد",
  },
  weight: {
    fr: "Poids",
    ar: "الوزن",
  },
  brut: {
    fr: "Brut",
    ar: "الوزن القائم",
  },
  tare: {
    fr: "Tare",
    ar: "التارة",
  },
  net: {
    fr: "Net",
    ar: "الصافي",
  },
  unitPrice: {
    fr: "Prix unitaire",
    ar: "ثمن الوحدة",
  },
  amount: {
    fr: "Montant (DA)",
    ar: "المجموع (دج)",
  },
  total: {
    fr: "TOTAL (DA)",
    ar: "المجموع",
  },
  notice: {
    fr: "Après huit (8) jours, l’emballage ne sera pas remboursé.",
    ar: "بعد ثمانية (8) أيام، لا يتم تعويض التغليف.",
  },
  signature: {
    fr: "Signature",
    ar: "الإمضاء",
  },
};

function formatCurrency(amountCents: number, currency = "DZD") {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function renderInvoiceHtml(
  invoice: Invoice,
  settings: CompanySettings,
  options: RenderOptions,
) {
  const locale = options.locale;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const itemsHtml = (invoice.items ?? [])
    .map((item) => {
      const brut = Number(item.weightBrut ?? 0);
      const tare = Number(item.weightTare ?? 0);
      const net = Number(item.weightNet ?? 0);
      return `<tr>
        <td>${item.marque ?? ""}</td>
        <td>${item.colisCount ?? ""}</td>
        <td>${item.product?.name ?? ""}</td>
        <td>${formatNumber(brut)}</td>
        <td>${formatNumber(tare)}</td>
        <td>${formatNumber(net)}</td>
        <td>${formatCurrency(Number(item.unitPriceCents ?? 0), invoice.currencyCode)}</td>
        <td>${formatCurrency(Number(item.amountCents ?? 0), invoice.currencyCode)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
  <html lang="${locale}" dir="${dir}">
    <head>
      <meta charset="utf-8" />
      <style>
        @page {
          size: A5 landscape;
          margin: 12mm;
        }
        body {
          font-family: "Segoe UI", "Tahoma", sans-serif;
          font-size: 12px;
          color: #111;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .company {
          width: 33%;
        }
        .title {
          text-align: center;
          font-weight: 700;
          font-size: 18px;
        }
        .meta {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px;
          text-align: center;
        }
        th {
          background: #f5f5f5;
        }
        .footer {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .total {
          font-weight: 700;
          font-size: 16px;
        }
        .signature {
          border-top: 1px solid #000;
          width: 200px;
          text-align: center;
          padding-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company">
          <strong>${settings.name}</strong><br />
          ${settings.marketName ?? ""}<br />
          ${settings.address ?? ""}<br />
          ${settings.phone ?? ""}
        </div>
        <div class="title">
          ${translate.title.fr}<br />
          <span style="font-size:14px">${translate.title.ar}</span>
        </div>
        <div class="number">
          ${translate.number.fr}: ${invoice.number}<br />
          ${translate.number.ar}: ${invoice.number}
        </div>
      </div>
      <div class="meta">
        <div>
          ${translate.deliveredTo.fr}: ${invoice.deliveredTo ?? ""}<br />
          ${translate.brand.fr}: ${invoice.brand ?? ""} / ${translate.packaging.fr}: ${invoice.packaging ?? ""} / ${translate.consignment.fr}: ${invoice.consignment ?? ""}
        </div>
        <div style="text-align:right">
          ${translate.deliveredTo.ar}: ${invoice.deliveredTo ?? ""}<br />
          ${translate.brand.ar}: ${invoice.brand ?? ""} / ${translate.packaging.ar}: ${invoice.packaging ?? ""} / ${translate.consignment.ar}: ${invoice.consignment ?? ""}
        </div>
      </div>
      <div class="meta">
        <div>
          ${translate.carreau.fr}: ${invoice.carreau ?? settings.carreauNo ?? ""}
        </div>
        <div style="text-align:right">
          ${translate.date.fr}: ${invoice.date}<br />
          ${translate.date.ar}: ${invoice.date}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>${translate.marque.fr}<br />${translate.marque.ar}</th>
            <th>${translate.colis.fr}<br />${translate.colis.ar}</th>
            <th>${translate.product.fr}<br />${translate.product.ar}</th>
            <th colspan="3">${translate.weight.fr}<br />${translate.weight.ar}</th>
            <th>${translate.unitPrice.fr}<br />${translate.unitPrice.ar}</th>
            <th>${translate.amount.fr}<br />${translate.amount.ar}</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>${translate.brut.fr}<br />${translate.brut.ar}</th>
            <th>${translate.tare.fr}<br />${translate.tare.ar}</th>
            <th>${translate.net.fr}<br />${translate.net.ar}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div class="footer">
        <div>
          ${translate.notice.fr}<br />${translate.notice.ar}
        </div>
        <div class="total">
          ${translate.total.fr}: ${formatCurrency(Number(invoice.totalCents), invoice.currencyCode)}
        </div>
        <div class="signature">
          ${translate.signature.fr}<br />${translate.signature.ar}
        </div>
      </div>
    </body>
  </html>`;
}
