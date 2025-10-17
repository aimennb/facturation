import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Input } from "../components/ui/Input.js";

const advances = [
  {
    supplier: "Sarl Zeralda Primeurs",
    date: "2024-02-01",
    reference: "ADV-001",
    amount: 50000,
  },
  {
    supplier: "Ferhani Import",
    date: "2024-02-04",
    reference: "ADV-002",
    amount: 30000,
  },
];

export const Advances = () => {
  const { t } = useTranslation(["common", "supplier"]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{t("supplier.advances")}</CardTitle>
        <div className="flex items-center gap-2">
          <Input type="date" className="max-w-[160px]" />
          <Button variant="primary">{t("actions.save")}</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">{t("supplier.title")}</th>
                <th className="px-4 py-3">{t("invoice:date")}</th>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Montant (DA)</th>
              </tr>
            </thead>
            <tbody>
              {advances.map((advance) => (
                <tr
                  key={advance.reference}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-3">{advance.supplier}</td>
                  <td className="px-4 py-3">{advance.date}</td>
                  <td className="px-4 py-3">{advance.reference}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    {new Intl.NumberFormat("fr-DZ", {
                      style: "currency",
                      currency: "DZD",
                    }).format(advance.amount)}
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
