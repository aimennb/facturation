import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.js";

export const Dashboard = () => {
  const { t } = useTranslation("common");

  const stats = [
    { label: "TOTAL (DA)", value: "1 245 000" },
    { label: "N. colis", value: "320" },
    { label: "Poids net (kg)", value: "5 640" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("nav.dashboard")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-emerald-50 p-4 text-center"
              >
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-800">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("actions.newInvoice")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Générez un nouveau bulletin d’achat en utilisant le menu «{" "}
            {t("nav.invoices")} ».
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
