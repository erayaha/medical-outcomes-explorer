# Medical Outcomes Explorer

Medical Outcomes Explorer is a fully static, SEO-friendly analytics site for exploring US hospital quality, outcomes, safety indicators, and related FDA medical device signals.

[![GitHub Pages](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-2563eb?logo=github&logoColor=white)](https://erayaha.github.io/medical-outcomes-explorer/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🌐 **Live Website**: Access the live public portal at **[erayaha.github.io/medical-outcomes-explorer](https://erayaha.github.io/medical-outcomes-explorer/)** deployed automatically on every push via `.github/workflows/deploy.yml`.

## What ships in this repo

- A GitHub Pages-ready static Next.js site with crawlable routes
- Versioned sample data snapshots under `/data/2026-05`
- Hospital overview, outcomes, interventions, devices, adverse events, methods, and `/eia` pages
- Structured data, sitemap, robots.txt, and long-form SEO content
- A starter data refresh script for CMS and openFDA snapshots
- GitHub Actions workflows for Pages deployment (`.github/workflows/deploy.yml`) and scheduled data refreshes (`.github/workflows/refresh-data.yml`)

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
