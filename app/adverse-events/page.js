import { TrendChart } from "@/components/trend-chart";
import { keywordMap } from "@/lib/site-config";
import { getDevices } from "@/lib/site-data";

export const metadata = {
  title: "Adverse events and recalls explorer",
  description:
    "Explore tracked openFDA device adverse-event and recall counts by product code using real government data.",
  keywords: keywordMap.adverseEvents,
};

export default function AdverseEventsPage() {
  const devices = getDevices();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Adverse events</p>
        <h1>Adverse event and recall explorer</h1>
        <p className="lede">
          These charts summarize yearly openFDA adverse-event and recall counts for the tracked product codes in the committed snapshot.
        </p>
      </section>
      <section className="grid-three">
        {devices.map((device) => (
          <article key={device.productCode} className="panel stack-gap">
            <h2>{device.productCode}</h2>
            <p>{device.deviceClass}</p>
            <TrendChart title="Adverse events" series={device.clearanceTimeline} dataKey="events" color="#dc2626" valueFormatter={(value) => `${value}`} />
            <p>Latest recall: {device.latestRecall?.classification || "Not available"} on {device.latestRecall?.date || "n/a"}.</p>
          </article>
        ))}
      </section>
    </div>
  );
}
