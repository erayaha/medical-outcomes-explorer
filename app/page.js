import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { TrendChart } from "@/components/trend-chart";
import { keywordMap, siteDescription, siteName } from "@/lib/site-config";
import { getDevices, getOutcomeOverview, getSnapshotMeta, getSnapshotSummary } from "@/lib/site-data";

export const metadata = {
  title: siteName,
  description:
    "Explore real CMS hospital outcomes, quality programs, and FDA device timelines through crawlable static pages built for search discovery.",
  keywords: keywordMap.home,
};

export default function HomePage() {
  const summary = getSnapshotSummary();
  const overview = getOutcomeOverview();
  const devices = getDevices();
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: siteName,
          description: siteDescription,
          keywords: keywordMap.home,
          dateModified: snapshotMeta.generatedAt,
        }}
      />
      <section className="hero">
        <div>
          <p className="eyebrow">SEO-first static health analytics</p>
          <h1>Medical Outcomes Explorer</h1>
          <p className="lede">
            Explore real CMS hospital quality records, CMS payment program metrics, and openFDA medical device activity in a static GitHub Pages experience.
          </p>
          <div className="button-row">
            <Link href="/hospitals" className="primary-button">
              Explore hospitals
            </Link>
            <Link href="/devices-fda" className="secondary-button">
              Explore FDA device activity
            </Link>
          </div>
          <p className="helper-text">Government snapshot generated {new Date(snapshotMeta.generatedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}.</p>
        </div>
        <div className="hero-card-grid">
          <div className="mini-card"><strong>{summary.hospitalCount}</strong><span>Hospitals in the current CMS snapshot</span></div>
          <div className="mini-card"><strong>{summary.averageRating ?? "n/a"}</strong><span>Average CMS overall rating</span></div>
          <div className="mini-card"><strong>{summary.averageReadmissionRatio ?? "n/a"}</strong><span>Average HRRP excess readmission ratio</span></div>
          <div className="mini-card"><strong>{summary.latestRecallCount}</strong><span>FDA recalls in the latest annual window across tracked device codes</span></div>
        </div>
      </section>

      <section className="grid-two">
        <article className="panel stack-gap">
          <div className="section-heading">
            <h2>CMS program comparison</h2>
            <p>Actual baseline-versus-performance rates from CMS HVBP and HRRP files.</p>
          </div>
          <TrendChart
            title="Average CMS HVBP mortality domain rate"
            series={overview.mortalityComparison}
            color="#0f766e"
            valueFormatter={(value) => value?.toFixed(4) ?? "n/a"}
          />
        </article>
        <article className="panel stack-gap">
          <div className="section-heading">
            <h2>Tracked FDA product codes</h2>
            <p>Counts below come from the tracked openFDA product-code snapshot.</p>
          </div>
          <ul className="list-grid">
            {devices.map((device) => (
              <li key={device.productCode} className="mini-card">
                <strong>{device.productCode}</strong>
                <span>{device.deviceClass}</span>
                <span>{device.clearanceTimeline.at(-1)?.events ?? 0} adverse events in {device.clearanceTimeline.at(-1)?.period}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid-three">
        <article className="panel"><h2>Hospitals</h2><p>Browse real CMS hospital records with current mortality, readmission, complication, and HAC fields.</p><Link href="/hospitals">View hospital explorer →</Link></article>
        <article className="panel"><h2>Interventions</h2><p>Compare real FY2026 HRRP, HVBP, and HACRP metrics across the tracked hospitals.</p><Link href="/interventions">Review intervention trends →</Link></article>
        <article className="panel"><h2>Methods & Data</h2><p>See the exact government endpoints, update cadence, and licensing notes used in this snapshot.</p><Link href="/methods-data">Read the methodology →</Link></article>
      </section>
    </div>
  );
}
