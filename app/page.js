import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { TrendChart } from "@/components/trend-chart";
import { keywordMap, siteDescription, siteName } from "@/lib/site-config";
import { getDevices, getHospitals, getSnapshotSummary } from "@/lib/site-data";

export const metadata = {
  title: siteName,
  description:
    "Explore CMS hospital outcomes, interventions, and FDA device timelines through crawlable static pages built for search discovery.",
  keywords: keywordMap.home,
};

export default function HomePage() {
  const hospitals = getHospitals();
  const devices = getDevices();
  const summary = getSnapshotSummary();

  return (
    <div className="container page-stack">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: siteName,
          description: siteDescription,
          keywords: keywordMap.home,
        }}
      />
      <section className="hero">
        <div>
          <p className="eyebrow">SEO-first static health analytics</p>
          <h1>Medical Outcomes Explorer</h1>
          <p className="lede">
            Compare hospital performance, outcomes, safety indicators, and exploratory FDA device signals in a fully static GitHub Pages experience.
          </p>
          <div className="button-row">
            <Link href="/hospitals" className="primary-button">
              Explore hospitals
            </Link>
            <Link href="/eia" className="secondary-button">
              Open the EIA workspace
            </Link>
          </div>
        </div>
        <div className="hero-card-grid">
          <div className="mini-card"><strong>{summary.hospitalCount}</strong><span>Hospitals in current snapshot</span></div>
          <div className="mini-card"><strong>{summary.averageRating}</strong><span>Average CMS rating</span></div>
          <div className="mini-card"><strong>{summary.latestReadmissions}%</strong><span>Average latest readmissions</span></div>
          <div className="mini-card"><strong>{summary.totalLatestEvents}</strong><span>Latest device adverse events in sample</span></div>
        </div>
      </section>

      <section className="grid-two">
        <article className="panel stack-gap">
          <div className="section-heading">
            <h2>Hospital outcomes over time</h2>
            <p>Trend summaries from the versioned CMS-style snapshot.</p>
          </div>
          <TrendChart title="Readmissions trend" series={hospitals[0].metrics} dataKey="readmissions" />
        </article>
        <article className="panel stack-gap">
          <div className="section-heading">
            <h2>Device clearance activity</h2>
            <p>Clearance and recall timing is shown as exploratory context, not causation.</p>
          </div>
          <TrendChart title="510(k) clearances" series={devices[0].clearanceTimeline} dataKey="clearances" color="#9333ea" />
        </article>
      </section>

      <section className="grid-three">
        <article className="panel"><h2>Hospitals</h2><p>Searchable hospital pages with metadata, ratings, program participation, and structured data markup.</p><Link href="/hospitals">View hospital explorer →</Link></article>
        <article className="panel"><h2>Interventions</h2><p>Before-and-after views for HRRP, HVBP, and HACRP with plain-language commentary.</p><Link href="/interventions">Review intervention trends →</Link></article>
        <article className="panel"><h2>Methods & Data</h2><p>Long-form methodology, licensing, limitations, and keyword-focused explainer content.</p><Link href="/methods-data">Read the methodology →</Link></article>
      </section>
    </div>
  );
}
