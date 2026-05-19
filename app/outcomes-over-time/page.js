import { TrendChart } from "@/components/trend-chart";
import { keywordMap } from "@/lib/site-config";
import { getHospitals, getMeasures } from "@/lib/site-data";

export const metadata = {
  title: "Hospital outcomes over time",
  description:
    "Track hospital mortality, readmissions, complications, and patient experience trends with long-form CMS-style explanations.",
  keywords: keywordMap.outcomes,
};

export default function OutcomesOverTimePage() {
  const hospitals = getHospitals();
  const measures = getMeasures();
  const cohortTrend = hospitals[0].metrics.map((metric, index) => ({
    period: metric.period,
    mortality: Number((hospitals.reduce((sum, hospital) => sum + hospital.metrics[index].mortality, 0) / hospitals.length).toFixed(1)),
    readmissions: Number((hospitals.reduce((sum, hospital) => sum + hospital.metrics[index].readmissions, 0) / hospitals.length).toFixed(1)),
    complications: Number((hospitals.reduce((sum, hospital) => sum + hospital.metrics[index].complications, 0) / hospitals.length).toFixed(1)),
  }));

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Outcomes over time</p>
        <h1>Hospital outcomes and quality trends over time</h1>
        <p className="lede">
          Compare multi-year patterns in mortality, readmissions, complications, and experience scores using static HTML that remains accessible to search engines.
        </p>
      </section>
      <section className="grid-three">
        <TrendChart title="Average mortality" series={cohortTrend} dataKey="mortality" />
        <TrendChart title="Average readmissions" series={cohortTrend} dataKey="readmissions" color="#2563eb" />
        <TrendChart title="Average complications" series={cohortTrend} dataKey="complications" color="#dc2626" />
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
