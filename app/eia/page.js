import Link from "next/link";
import { LiveDeviceFeed } from "@/components/live-device-feed";
import { HospitalExplorer } from "@/components/hospital-explorer";
import { getDevices, getHospitals } from "@/lib/site-data";

export const metadata = {
  title: "EIA standalone explorer workspace",
  description:
    "Use the standalone EIA workspace to browse hospitals and preview live openFDA device results without any backend.",
};

export default function EIAPage() {
  const hospitals = getHospitals();
  const devices = getDevices();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">EIA workspace</p>
        <h1>Standalone explorer for hospital outcomes and device intelligence</h1>
        <p className="lede">
          The `/eia` route packages the hospital explorer and live device feed into a single browser-friendly experience for manual testing and demos.
        </p>
      </section>
      <section className="grid-two">
        <article className="panel stack-gap">
          <h2>Snapshot modules</h2>
          <ul>
            <li>{hospitals.length} crawlable hospital profiles</li>
            <li>{devices.length} pre-rendered device product-code pages</li>
            <li>Live openFDA 510(k) sample with localStorage caching</li>
          </ul>
          <div className="button-row">
            <Link href="/hospitals" className="primary-button">Hospital routes</Link>
            <Link href="/devices-fda" className="secondary-button">Device routes</Link>
          </div>
        </article>
        <article className="panel stack-gap">
          <h2>Why this route exists</h2>
          <p>The EIA module is kept browser-testable in standalone mode so future client-side analysis can be verified outside of any Office.js or Word-specific environment.</p>
          <p>Everything shown here is compatible with static hosting and GitHub Pages deployment.</p>
        </article>
      </section>
      <HospitalExplorer hospitals={hospitals} />
      <LiveDeviceFeed />
    </div>
  );
}
