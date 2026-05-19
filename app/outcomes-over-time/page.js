import { TrendChart } from "@/components/trend-chart";
import { keywordMap } from "@/lib/site-config";
import { getMeasures, getOutcomeOverview, getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "Hospital outcomes over time",
  description:
    "Track published CMS baseline-versus-performance outcomes and current complication, readmission, and HAC measures using real government data.",
  keywords: keywordMap.outcomes,
};

export default function OutcomesOverTimePage() {
  const measures = getMeasures();
  const overview = getOutcomeOverview();
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Outcomes over time</p>
        <h1>CMS outcomes across baseline, performance, and current reporting windows</h1>
        <p className="lede">
          These charts aggregate the tracked hospitals’ published CMS baseline-versus-performance program fields and current safety scores. Snapshot generated {new Date(snapshotMeta.generatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}.
        </p>
      </section>
      <section className="grid-three">
        <TrendChart
          title="Average HVBP mortality domain rate"
          series={overview.mortalityComparison}
          color="#0f766e"
          valueFormatter={(value) => value?.toFixed(4) ?? "n/a"}
        />
        <TrendChart
          title="Average HRRP readmission rate"
          series={overview.readmissionComparison}
          color="#2563eb"
          valueFormatter={(value) => value?.toFixed(2) ?? "n/a"}
        />
        <TrendChart
          title="Current HAC total scores by state"
          series={overview.safetyScores}
          color="#ca8a04"
          valueFormatter={(value) => value?.toFixed(4) ?? "n/a"}
        />
      </section>
      <section className="grid-two">
        {measures.map((measure) => (
          <article key={measure.id} className="panel stack-gap">
            <h2>{measure.name}</h2>
            <p>{measure.description}</p>
            <p>{measure.methodology}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
