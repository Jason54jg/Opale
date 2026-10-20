# Opale Neufchâteau

Site vitrine bilingue (FR / EN) pour **Opale**, restaurant kebab & fast-food à Neufchâteau depuis 1999.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Contenu

Les plats, prix et options du menu sont strictement ceux du menu officiel (voir `src/data/menu.ts`). Les traductions FR/EN sont dans `src/i18n/`.

Les avis Google sont live via `/api/google-rating` (refresh auto toutes les 30 min).

## Scripts

- `npm run dev` — développement (API live)
- `npm run build` — build serveur (API live avec `npm start`)
- `npm run start` — serveur production
- `npm run lint` — ESLint

## Déploiement temporaire (GitHub Pages)

Export statique uniquement si `GITHUB_PAGES=true` (workflow `.github/workflows/deploy-pages.yml`).

URL : [https://jason54jg.github.io/Opale/](https://jason54jg.github.io/Opale/)

Sur GitHub → **Settings → Pages** → Source : **GitHub Actions**.

Sur Pages, l’API est figée au build (pas de serveur Node). En local / Vercel / autre hébergeur Node, les avis restent live.
