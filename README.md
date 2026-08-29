# Medical Outcomes Explorer

Medical Outcomes Explorer is the premier open healthcare analytics and visualization platform for **MedTech Companies**, **Hospital Leadership & Quality Officers**, **Academic Epidemiologists**, and **Clinical Trial Sponsors / CROs**.

[![GitHub Pages](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-2563eb?logo=github&logoColor=white)](https://erayaha.github.io/medical-outcomes-explorer/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Test Suite](https://img.shields.io/badge/Tests-73%2F73%20Passing-10b981?logo=jest&logoColor=white)](https://jestjs.io)
[![Code Coverage](https://img.shields.io/badge/Coverage-98.6%25-10b981)](https://istanbul.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🌐 **Live Website**: Access the live public portal at **[erayaha.github.io/medical-outcomes-explorer](https://erayaha.github.io/medical-outcomes-explorer/)** deployed automatically on every push via `.github/workflows/deploy.yml`.

---

## 🎯 Stakeholder Capabilities & Value Matrix

| Stakeholder Persona | Key Features & Decision Support |
|---|---|
| **🏥 Hospital Leadership & Quality Officers** | • **HRRP Readmission Penalty Modeler**: Real-time excess readmission ratios (ERR) and penalty risk forecasting.<br>• **HACRP Infection SIR Radars**: Standardized Infection Ratios for CLABSI, CAUTI, SSI, CDI, and MRSA.<br>• **HVBP Improvement Baselines**: Clinical outcomes domain baseline-vs-performance rates.<br>• **Multi-Hospital Benchmark Comparator**: Side-by-side metric diffs and penalty comparisons. |
| **🔬 MedTech & Regulatory Affairs** | • **MAUDE Adverse Event Surveillance**: Multi-year signal tracking across Deaths, Injuries, and Malfunctions.<br>• **FDA Class I/II/III Recall Radar**: Root-cause categorization, firm history, and hazard classifications.<br>• **510(k) Clearance Velocity**: Predicate evolution and decision timelines across 8 therapeutic areas.<br>• **Device-to-Hospital Surgical Outcomes Linkage**: Cross-domain mapping connecting device failure modes to complication indicators (e.g. `COMP_HIP_KNEE`, `PSI_90`). |
| **📊 Academics & Epidemiologists** | • **Longitudinal Outcome Modeling**: 5-year historical trends in risk-adjusted 30-day mortality (`AMI`, `HF`, `PN`, `STK`, `CABG`).<br>• **Excess Days in Acute Care (EDAC-30)**: Post-discharge return day distributions.<br>• **Open Data Workbench & API Provenance**: Instant raw JSON and CSV exports with verified federal dataset citations. |
| **🧪 Clinical Trial Sponsors & CROs** | • **Site Qualification Profiling**: Academic medical center research tiering (Tier 1 AMC benchmarks).<br>• **Clinical Capacity Index**: Licensed bed counts, specialty procedure volumes, and clinical trial readiness scores.<br>• **Centers of Excellence**: Rapid therapeutic identification (Cardiovascular, Orthopedic, Oncology, Neurovascular). |

---

## 🏗 Key Application Routes

- `/` – Executive intelligence dashboard with interactive Stakeholder Persona Switcher
- `/compare` – Interactive Multi-Hospital Quality & Penalty Risk Benchmark Comparator (with CSV export)
- `/clinical-trials` – Clinical Trial Site Qualification & Capacity Explorer
- `/research-api` – Open Data Workbench, CSV/JSON Exporters & Federal API Provenance
- `/hospitals` – Complete searchable CMS hospital directory
- `/hospitals/{cms_id}-{slug}` – Deep-dive hospital scorecard with confidence intervals and infection SIRs
- `/devices-fda` – FDA Medical Device Post-Market Surveillance Matrix
- `/devices-fda/{product_code}` – Product-code deep dive (510k, recalls, MAUDE events, hospital linkages)
- `/outcomes-over-time` – Longitudinal CMS mortality and return day trends
- `/interventions` – Federal value-based policy explorer (HRRP, HVBP, HACRP)
- `/adverse-events` – Cross-device MAUDE adverse events and recall explorer
- `/methods-data` – Methodological documentation and risk-adjustment formulas
- `/eia` – Standalone early intervention analytics overview

---

## 💻 Local Development

```bash
yarn install
yarn dev
```

The development server runs at `http://localhost:3000` (or `http://localhost:4000`).

### Automated Testing & Static Export

```bash
# Run all unit and integration tests (73 tests, 10 suites)
yarn test

# Run test coverage report (98.6% statement coverage)
yarn test:coverage

# Build optimized static export for GitHub Pages (33 static pages)
PAGES_BASE_PATH=/medical-outcomes-explorer SITE_URL=https://erayaha.github.io/medical-outcomes-explorer yarn build
```

---

## 🔄 Government Data Refresh

To pull the latest live CMS hospital datasets (`data.cms.gov`) and openFDA medical device records (`api.fda.gov`):

```bash
yarn data:refresh
```

---

## 📄 License

MIT License. Public datasets remain subject to original CMS and FDA terms and source attribution requirements.
