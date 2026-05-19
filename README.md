# Medical Outcomes Explorer

Medical Outcomes Explorer is a fully static, SEO-friendly analytics site for exploring US hospital quality, outcomes, safety indicators, and related FDA medical device signals.

## What ships in this repo

- A GitHub Pages-ready static Next.js site with crawlable routes
- Versioned sample data snapshots under `/data/2026-05`
- Hospital overview, outcomes, interventions, devices, adverse events, methods, and `/eia` pages
- Structured data, sitemap, robots.txt, and long-form SEO content
- A starter data refresh script for CMS and openFDA snapshots
- GitHub Actions workflows for Pages deployment and scheduled data refreshes

## Local development

```bash
yarn install
yarn dev
```

The development server runs at `https://localhost:4000`.

## Data approach

This starter implementation keeps the site fully static by pre-rendering pages from versioned JSON in `/data/YYYY-MM`. The included `yarn data:refresh` script demonstrates how to fetch a small CMS hospital sample and a small openFDA device sample at build time for future scheduled refreshes.

## Key routes

- `/` – landing page
- `/hospitals`
- `/hospitals/{cms_id}-{slug}`
- `/outcomes-over-time`
- `/interventions`
- `/devices-fda`
- `/devices-fda/{product_code}`
- `/adverse-events`
- `/methods-data`
- `/eia`

## License

MIT for code. Public datasets remain subject to their original terms and source attribution requirements.
