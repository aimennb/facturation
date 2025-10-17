# Facturation – Bulletin d’achat

Solution complète (backend NestJS + frontend React) pour la gestion et l’édition de bulletins d’achat bilingues (Français / Arabe) avec génération PDF fidèle au gabarit papier.

## Architecture

- **Backend** : NestJS, TypeORM, PostgreSQL, JWT, Puppeteer pour le PDF
- **Frontend** : React + Vite, TailwindCSS + composants inspirés shadcn/ui, react-i18next avec support RTL
- **Base de données** : PostgreSQL avec migrations TypeORM et scripts de seed
- **Tests** : 15 tests unitaires + 5 tests e2e (Jest + Supertest)
- **CI local** : npm scripts pour lint, build et test

## Prérequis

- Node.js 20+
- npm 9+
- Docker (optionnel mais recommandé)

## Installation rapide (monorepo)

```bash
npm install --workspaces
```

### Backend

```bash
cd apps/backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

### Frontend

```bash
cd apps/frontend
cp .env.example .env
npm install
npm run dev
```

### Lancer via Docker Compose

```bash
docker compose up --build
```

Services exposés :

- Backend API : http://localhost:4000/api
- Frontend : http://localhost:5173
- PostgreSQL : localhost:5432

## Scripts utiles

| Commande | Description |
| --- | --- |
| `npm run build --workspaces` | Build frontend + backend |
| `npm run lint --workspaces` | Lint des sources |
| `npm run test --workspaces` | Tests unitaires |
| `npm run test:e2e --workspaces` | Tests end-to-end |
| `npm run db:migrate` | Migrations DB (backend) |
| `npm run db:seed` | Jeu de données de démonstration |

## Fonctionnalités clés

- Authentification JWT (ADMIN, VENDEUR, FOURNISSEUR) et garde de rôles
- CRUD produits, fournisseurs, paiements, avances
- Génération séquentielle des numéros de factures avec remplissage automatique
- Calculs automatiques (Net = Brut − Tare, montants, totaux)
- Export PDF format A5 paysage bilingue fidèle au bulletin papier
- Dashboard avec KPIs, listes filtrées (factures, fournisseurs, avances)
- Portail fournisseur autonome (consultation, téléchargement PDF)
- Internationalisation FR / AR avec bascule RTL
- Rapports (CA, produits, soldes) + export CSV
- Journal d’audit des opérations sensibles
- Accessibilité : contrastes forts, navigation clavier sur la table des factures

## Tests

```bash
npm run test --workspaces
npm run test:e2e --workspaces
```

Les tests couvrent :

- Calcul des soldes fournisseurs
- Génération d’items et séquences factures
- Rendu HTML bilingue du PDF
- Services de configuration
- API e2e mockée pour les factures

## Assets fournis

- Gabarit HTML/CSS pour le PDF (A5 paysage)
- Captures d’écran (voir dossier `reports/` après exécution des tests e2e)
- Exemple de PDF (généré via `/invoices/:id/pdf`)

## Sécurité & Qualité

- Validation des DTO (class-validator)
- Règles ESLint + Prettier harmonisées
- Rate friendly logs via Pino
- Configuration 12-factor (variables d’environnement)
- Scripts reproductibles (migrations + seeds)

## Prochaines étapes

- Implémentation temps réel (WebSockets) pour suivi des ventes
- Génération d’avoirs/verrouillage des factures
- Intégration SMS pour notifications fournisseurs
