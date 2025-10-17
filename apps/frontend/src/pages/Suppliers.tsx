import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';

import { Button } from '../components/ui/Button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.js';

const suppliers = [
  { name: 'Sarl Zeralda Primeurs', brand: 'ZP', balance: 56000 },
  { name: 'Ferhani Import', brand: 'FI', balance: -32000 }
];

export const Suppliers = () => {
  const { t } = useTranslation('supplier');

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{t('title')}</CardTitle>
        <Button variant="secondary" className="gap-2">
          <Download className="h-4 w-4" />
          {t('export')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">{t('title')}</th>
                <th className="px-4 py-3">Marque</th>
                <th className="px-4 py-3">{t('balance')}</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.brand} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-800">{supplier.name}</td>
                  <td className="px-4 py-3 text-slate-500">{supplier.brand}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(supplier.balance)}
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
