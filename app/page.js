import Link from "next/link";
import { StakeholderPersonaBar } from "@/components/stakeholder-persona-bar";
import { StructuredData } from "@/components/structured-data";
import { TrendChart } from "@/components/trend-chart";
import { keywordMap, siteDescription, siteName } from "@/lib/site-config";
import { getDevices, getOutcomeOverview, getSnapshotMeta, getSnapshotSummary } from "@/lib/site-data";

export const metadata = {
  title: `${siteName} — Open Medical Analytics & Post-Market Surveillance`,
  description:
    "Open healthcare intelligence platform for MedTech, hospital leadership, academics, and clinical trial sponsors. Ingests CMS hospital quality measures and FDA medical device post-market surveillance.",
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
          <p className="eyebrow">Open Healthcare Intelligence & Post-Market Surveillance</p>
          <h1>Medical Outcomes Explorer</h1>
          <p className="lede">
            The open medical visualization platform for hospital quality leaders, medtech regulatory teams, academic epidemiologists, and clinical trial sponsors. Powered by verified CMS Provider Data and openFDA repositories.
          </p>
          <div className="button-row">
            <Link href="/hospitals" className="primary-button">
              🏥 Explore Hospitals
            </Link>
            <Link href="/compare" className="secondary-button">
              ⚖️ Benchmark Comparator
            </Link>
            <Link href="/devices-fda" className="secondary-button">
              🔬 FDA Device Matrix
            </Link>
            <Link href="/clinical-trials" className="secondary-button">
              🧪 Clinical Trials
            </Link>
          </div>
          <p className="helper-text">
            Government snapshot generated {new Date(snapshotMeta.generatedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}.
          </p>
        </div>
        <div className="hero-card-grid">
          <div className="mini-card">
            <strong>{summary.hospitalCount}</strong>
            <span>Benchmark US Hospitals & Academic Centers</span>
          </div>
          <div className="mini-card">
            <strong>{summary.averageRating ? `${summary.averageRating.toFixed(1)} / 5★` : "n/a"}</strong>
            <span>Average CMS Quality Star Rating</span>
          </div>
          <div className="mini-card">
            <strong>{devices.length}</strong>
            <span>Tracked FDA Medical Device Therapeutic Areas</span>
          </div>
          <div className="mini-card">
            <strong>{summary.latestRecallCount}</strong>
            <span>FDA Recalls in latest surveillance window</span>
          </div>
        </div>
      </section>

      <StakeholderPersonaBar />

      <section className="grid-two">
        <article className="panel stack-gap">
          <div className="section-heading">
            <h2>CMS Value-Based Improvement Trends</h2>
            <p>Baseline-versus-performance mortality rates from the CMS Hospital Value-Based Purchasing (HVBP) domain.</p>
          </div>
          <TrendChart
            title="Average CMS HVBP Mortality Domain Rate"
            series={overview.mortalityComparison}
            color="#0f766e"
            valueFormatter={(value) => value?.toFixed(4) ?? "n/a"}
          />
        </article>
        <article className="panel stack-gap">
          <div className="section-heading">
            <h2>Tracked FDA Therapeutic Product Areas</h2>
            <p>Post-market MAUDE adverse event telemetry and 510(k) clearances.</p>
          </div>
          <ul className="list-grid">
            {devices.map((device) => (
              <li key={device.productCode} className="mini-card">
                <strong>Code {device.productCode}</strong>
                <span>{device.deviceClass}</span>
                <span className="helper-text">{device.therapeuticArea || device.medicalSpecialty}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid-three">
        <article className="panel">
          <h2>🏥 Multi-Hospital Comparator</h2>
          <p>Side-by-side benchmarking of 30-day mortality, HRRP readmission penalty risk, and infection standardized infection ratios.</p>
          <Link href="/compare">Launch comparator tool →</Link>
        </article>
        <article className="panel">
          <h2>🔬 FDA Post-Market Surveillance</h2>
          <p>Surveillance matrix across 8 therapeutic areas tracking MAUDE deaths, injuries, malfunctions, and Class I recalls.</p>
          <Link href="/devices-fda">View device surveillance →</Link>
        </article>
        <article className="panel">
          <h2>🧪 Clinical Trial Facility Qualification</h2>
          <p>Academic medical center research tiering, bed capacity, and specialty centers of excellence for clinical trial sponsors.</p>
          <Link href="/clinical-trials">Explore trial sites →</Link>
        </article>
        <article className="panel">
          <h2>📊 Open Data & Research API</h2>
          <p>Download pristine CMS hospital datasets and openFDA device snapshots in structured JSON and CSV formats.</p>
          <Link href="/research-api">Access data workbench →</Link>
        </article>
        <article className="panel">
          <h2>📈 Longitudinal Outcomes</h2>
          <p>Compare expected vs predicted readmission return days (EDAC-30) and longitudinal mortality trends.</p>
          <Link href="/outcomes-over-time">Explore time trends →</Link>
        </article>
        <article className="panel">
          <h2>📋 Policy & Interventions</h2>
          <p>In-depth analysis of federal value-based programs: HRRP penalties, HVBP value multipliers, and HACRP safety reductions.</p>
          <Link href="/interventions">Review policy trends →</Link>
        </article>
      </section>
    </div>
  );
}
