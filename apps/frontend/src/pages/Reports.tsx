import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.js";

const data = [
  { date: "01/02", total: 120000 },
  { date: "02/02", total: 150000 },
  { date: "03/02", total: 98000 },
  { date: "04/02", total: 162000 },
];

export const Reports = () => {
  const { t } = useTranslation("common");

  const chartData = useMemo(
    () => data.map((item) => ({ ...item, total: item.total / 1000 })),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("nav.reports")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            >
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit="k" />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)} kDA`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#047857"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {t("nav.reports")} · Données de démonstration pour illustrer
          l’évolution quotidienne du chiffre d’affaires.
        </p>
      </CardContent>
    </Card>
  );
};
