import Link from "next/link";
import { LiveDeviceFeed } from "@/components/live-device-feed";
import { TrendChart } from "@/components/trend-chart";
import { keywordMap } from "@/lib/site-config";
import { getDevices } from "@/lib/site-data";

export const metadata = {
  title: "FDA medical device clearance explorer",
  description:
    "Explore static device class pages plus live openFDA 510(k) samples with localStorage caching for refreshable device research.",
  keywords: keywordMap.devices,
};

export default function DevicesPage() {
  const devices = getDevices();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Devices & FDA</p>
        <h1>Explore FDA 510(k) device clearance timelines</h1>
        <p className="lede">
          Product-code detail pages are pre-rendered for SEO, while the live panel below demonstrates key-free openFDA fetching with client-side caching.
        </p>
      </section>
      <section className="grid-three">
        {devices.map((device) => (
          <article key={device.productCode} className="panel stack-gap">
            <h2>{device.deviceClass}</h2>
            <p>{device.summary}</p>
            <TrendChart title={`${device.productCode} clearances`} series={device.clearanceTimeline} dataKey="clearances" color="#9333ea" />
            <Link href={`/devices-fda/${device.productCode}`}>View product code {device.productCode} →</Link>
          </article>
        ))}
      </section>
      <LiveDeviceFeed />
    </div>
  );
}
