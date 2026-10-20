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

## Scripts

- `npm run dev` — développement
- `npm run build` — export statique (`out/`)
- `npm run lint` — ESLint

## Déploiement (GitHub Pages)

Le site est exporté en statique et déployé automatiquement sur push `main` via `.github/workflows/deploy-pages.yml`.

URL : [https://jason54jg.github.io/Opale/](https://jason54jg.github.io/Opale/)

Sur GitHub → **Settings → Pages** → Source : **GitHub Actions**.

Build local pour Pages (PowerShell) :

```powershell
$env:GITHUB_PAGES="true"; npm run build
```

Les avis Google sont récupérés au moment du build (pas d’API runtime sur Pages).
