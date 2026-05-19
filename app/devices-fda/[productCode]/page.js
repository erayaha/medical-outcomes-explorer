import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { TrendChart } from "@/components/trend-chart";
import { getDeviceByProductCode, getDeviceMeasureLinks, getDevices, getMeasures } from "@/lib/site-data";

export function generateStaticParams() {
  return getDevices().map((device) => ({ productCode: device.productCode }));
}

export function generateMetadata({ params }) {
  const device = getDeviceByProductCode(params.productCode);

  if (!device) {
    return {};
  }

  return {
    title: `${device.productCode} FDA device timeline`,
    description: `Review the real openFDA ${device.deviceClass} product code page, including yearly clearance, recall, and adverse-event counts.`,
  };
}

export default function DeviceDetailPage({ params }) {
  const device = getDeviceByProductCode(params.productCode);

  if (!device) {
    notFound();
  }

  const mapping = getDeviceMeasureLinks(device.productCode);
  const relatedMeasures = getMeasures().filter((measure) => mapping.measureIds.includes(measure.id));

  return (
    <div className="container page-stack">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalDevice",
          name: device.deviceClass,
          identifier: device.productCode,
        }}
      />
      <section className="page-header">
        <p className="eyebrow">Device detail</p>
        <h1>{device.deviceClass}</h1>
        <p className="lede">{device.summary}</p>
      </section>
      <section className="grid-two">
        <TrendChart title="510(k) clearances" series={device.clearanceTimeline} dataKey="clearances" color="#9333ea" valueFormatter={(value) => `${value}`} />
        <TrendChart title="Adverse events" series={device.clearanceTimeline} dataKey="events" color="#dc2626" valueFormatter={(value) => `${value}`} />
      </section>
      <section className="grid-two">
        <article className="panel stack-gap">
          <h2>Latest FDA records</h2>
          <p><strong>Latest 510(k):</strong> {device.latest510k?.kNumber || "Not available"} — {device.latest510k?.deviceName || "No current device name listed"}</p>
          <p><strong>Applicant:</strong> {device.latest510k?.applicant || "Not available"}</p>
          <p><strong>Latest recall:</strong> {device.latestRecall?.classification || "Not available"} on {device.latestRecall?.date || "n/a"}</p>
          <p>{device.latestRecall?.reason || "No recall reason listed."}</p>
          <p><strong>Latest event type:</strong> {device.latestEvent?.eventType || "Not available"}</p>
        </article>
        <article className="panel stack-gap">
          <h2>Related hospital measures</h2>
          <p>{mapping.rationale}</p>
          <ul className="list-grid">
            {relatedMeasures.map((measure) => (
              <li key={measure.id} className="mini-card">
                <strong>{measure.name}</strong>
                <span>{measure.description}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
