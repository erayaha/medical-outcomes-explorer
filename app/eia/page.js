import Link from "next/link";
import { LiveDeviceFeed } from "@/components/live-device-feed";
import { HospitalExplorer } from "@/components/hospital-explorer";
import { getDevices, getHospitals, getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "EIA standalone explorer workspace",
  description:
    "Use the standalone EIA workspace to browse real CMS hospitals and preview live openFDA device results without any backend.",
};

export default function EIAPage() {
  const hospitals = getHospitals();
  const devices = getDevices();
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">EIA workspace</p>
        <h1>Standalone explorer for hospital outcomes and device intelligence</h1>
        <p className="lede">
          The `/eia` route combines the real CMS hospital snapshot and the live openFDA panel for browser-first validation. Snapshot generated {new Date(snapshotMeta.generatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}.
        </p>
      </section>
      <section className="grid-two">
        <article className="panel stack-gap">
          <h2>Snapshot modules</h2>
          <ul>
            <li>{hospitals.length} crawlable hospital profiles from CMS</li>
            <li>{devices.length} pre-rendered device product-code pages from openFDA</li>
            <li>Live openFDA 510(k) records with localStorage caching</li>
          </ul>
          <div className="button-row">
            <Link href="/hospitals" className="primary-button">Hospital routes</Link>
            <Link href="/devices-fda" className="secondary-button">Device routes</Link>
          </div>
        </article>
        <article className="panel stack-gap">
          <h2>Why this route exists</h2>
          <p>The EIA module stays standalone so it can be verified locally and on GitHub Pages without Office.js dependencies.</p>
          <p>Every statistic shown in the static portions of this route comes from the committed government data snapshot.</p>
        </article>
      </section>
      <HospitalExplorer hospitals={hospitals} />
      <LiveDeviceFeed />
    </div>
  );
}
