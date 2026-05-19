import Link from "next/link";
import { LiveDeviceFeed } from "@/components/live-device-feed";
import { TrendChart } from "@/components/trend-chart";
import { keywordMap } from "@/lib/site-config";
import { getDevices, getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "FDA medical device clearance explorer",
  description:
    "Explore tracked openFDA product-code pages plus live 510(k) records with localStorage caching for browser refreshes.",
  keywords: keywordMap.devices,
};

export default function DevicesPage() {
  const devices = getDevices();
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Devices & FDA</p>
        <h1>Explore tracked FDA 510(k), recall, and adverse-event timelines</h1>
        <p className="lede">
          The product-code pages below are pre-rendered from the committed openFDA snapshot. Live 510(k) records are also available in the browser panel. Snapshot generated {new Date(snapshotMeta.generatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}.
        </p>
      </section>
      <section className="grid-three">
        {devices.map((device) => (
          <article key={device.productCode} className="panel stack-gap">
            <h2>{device.deviceClass}</h2>
            <p>{device.summary}</p>
            <TrendChart title={`${device.productCode} yearly FDA counts`} series={device.clearanceTimeline} dataKey="clearances" color="#9333ea" valueFormatter={(value) => `${value}`} />
            <Link href={`/devices-fda/${device.productCode}`}>View product code {device.productCode} →</Link>
          </article>
        ))}
      </section>
      <LiveDeviceFeed />
    </div>
  );
}
