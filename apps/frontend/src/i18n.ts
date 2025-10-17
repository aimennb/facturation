import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frCommon from './locales/fr/common.json';
import arCommon from './locales/ar/common.json';
import frInvoice from './locales/fr/invoice.json';
import arInvoice from './locales/ar/invoice.json';
import frSupplier from './locales/fr/supplier.json';
import arSupplier from './locales/ar/supplier.json';

void i18n.use(initReactI18next).init({
  resources: {
    fr: {
      common: frCommon,
      invoice: frInvoice,
      supplier: frSupplier
    },
    ar: {
      common: arCommon,
      invoice: arInvoice,
      supplier: arSupplier
    }
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
