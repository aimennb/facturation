import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Printer } from 'lucide-react';

import { Button } from '../components/ui/Button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.js';
import { Input } from '../components/ui/Input.js';

interface InvoiceItem {
  marque: string;
  colis: number;
  product: string;
  brut: number;
  tare: number;
  unitPrice: number;
}

const demoItems: InvoiceItem[] = [
  { marque: 'ZP', colis: 12, product: 'Tomate', brut: 150, tare: 10, unitPrice: 250 },
  { marque: 'FI', colis: 18, product: 'Pomme de terre', brut: 200, tare: 12, unitPrice: 120 },
  { marque: 'ZP', colis: 8, product: 'Courgette', brut: 90, tare: 6, unitPrice: 300 }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(value);

export const Invoices = () => {
  const { t } = useTranslation(['invoice', 'common']);
  const [filter, setFilter] = useState('');

  const items = useMemo(() => {
    if (!filter) return demoItems;
    return demoItems.filter((item) => item.product.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const net = item.brut - item.tare;
        return {
          colis: acc.colis + item.colis,
          net: acc.net + net,
          amount: acc.amount + net * item.unitPrice
        };
      },
      { colis: 0, net: 0, amount: 0 }
    );
  }, [items]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Recherche"
              className="max-w-xs"
            />
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" />
              {t('common:actions.newInvoice')}
            </Button>
            <Button variant="ghost" className="gap-2">
              <Printer className="h-4 w-4" />
              {t('common:actions.print')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="rounded-l-lg bg-slate-100 px-3 py-2">
                    {t('table.marque')} / {t('table.marque', { ns: 'invoice', lng: 'ar' })}
                  </th>
                  <th className="bg-slate-100 px-3 py-2">{t('table.colis')}</th>
                  <th className="bg-slate-100 px-3 py-2">{t('table.product')}</th>
                  <th className="bg-slate-100 px-3 py-2">{t('table.weight')}</th>
                  <th className="bg-slate-100 px-3 py-2">{t('table.brut')}</th>
                  <th className="bg-slate-100 px-3 py-2">{t('table.tare')}</th>
                  <th className="bg-slate-100 px-3 py-2">{t('table.net')}</th>
                  <th className="rounded-r-lg bg-slate-100 px-3 py-2">{t('table.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const net = item.brut - item.tare;
                  return (
                    <tr key={index} className="rounded-lg bg-white shadow-sm">
                      <td className="px-3 py-2 text-sm font-semibold text-emerald-700">{item.marque}</td>
                      <td className="px-3 py-2 text-sm">{item.colis}</td>
                      <td className="px-3 py-2 text-sm">{item.product}</td>
                      <td className="px-3 py-2 text-xs text-slate-400">{t('table.weight')}</td>
                      <td className="px-3 py-2 text-sm">{net.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm">{item.tare.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm">{net.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm text-emerald-700">{formatCurrency(net * item.unitPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-col gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {t('table.colis')}: <strong>{totals.colis}</strong>
            </span>
            <span>
              {t('table.net')}: <strong>{totals.net.toFixed(2)} kg</strong>
            </span>
            <span>
              {t('totals.total')}: <strong>{formatCurrency(totals.amount)}</strong>
            </span>
            <span className="text-xs text-emerald-600">{t('notice')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
