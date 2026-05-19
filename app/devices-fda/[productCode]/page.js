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
    title: `${device.productCode} FDA device clearance timeline`,
    description: `Review the exploratory ${device.deviceClass} product code page, including clearances, recalls, and related hospital outcome measures.`,
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
        <TrendChart title="510(k) clearances" series={device.clearanceTimeline} dataKey="clearances" color="#9333ea" />
        <TrendChart title="Adverse events" series={device.clearanceTimeline} dataKey="events" color="#dc2626" />
      </section>
      <section className="grid-two">
        <article className="panel stack-gap">
          <h2>Latest recall signal</h2>
          <p><strong>{device.latestRecall.classification}</strong> — {device.latestRecall.date}</p>
          <p>{device.latestRecall.reason}</p>
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
