import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.js";

const invoices = [
  { number: "0000001", date: "2024-02-01", amount: 120000 },
  { number: "0000002", date: "2024-02-05", amount: 98000 },
];

export const Portal = () => {
  const { t } = useTranslation(["supplier", "invoice"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("supplier.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          {t("invoice:title")} · Accédez à vos bulletins d’achat et soldes.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  {t("invoice:number", { defaultValue: "N°" })}
                </th>
                <th className="px-4 py-3">{t("invoice:date")}</th>
                <th className="px-4 py-3">{t("invoice:totals.total")}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.number} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    {invoice.number}
                  </td>
                  <td className="px-4 py-3">{invoice.date}</td>
                  <td className="px-4 py-3 font-medium text-emerald-700">
                    {new Intl.NumberFormat("fr-DZ", {
                      style: "currency",
                      currency: "DZD",
                    }).format(invoice.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
