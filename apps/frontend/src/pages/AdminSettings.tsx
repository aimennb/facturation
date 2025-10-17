import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';

export const AdminSettings = () => {
  const { t } = useTranslation('common');
  const [form, setForm] = useState({ name: 'Khenouci Chabane', carreau: '12', footer: t('invoice:notice') });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Paramètres enregistrés');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('nav.settings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-600">Nom de la société</span>
            <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-600">Carreau n°</span>
            <Input value={form.carreau} onChange={(event) => setForm((prev) => ({ ...prev, carreau: event.target.value }))} />
          </label>
          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium text-slate-600">Mention de pied de page</span>
            <Input value={form.footer} onChange={(event) => setForm((prev) => ({ ...prev, footer: event.target.value }))} />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">{t('actions.save')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
