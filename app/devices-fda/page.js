import { DeviceSignalMatrix } from "@/components/device-signal-matrix";
import { LiveDeviceFeed } from "@/components/live-device-feed";
import { keywordMap } from "@/lib/site-config";
import { getAllDeviceMeasureLinks, getDevices, getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "FDA Medical Device Post-Market Surveillance & 510(k) Matrix | Medical Outcomes Explorer",
  description:
    "Post-market surveillance matrix across 8 medical device therapeutic areas tracking 510(k) clearances, MAUDE adverse events (Deaths, Injuries, Malfunctions), and Class I/II/III recalls.",
  keywords: keywordMap.devices,
};

export default function DevicesPage() {
  const devices = getDevices();
  const deviceMappings = getAllDeviceMeasureLinks();
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <span className="badge badge-accent">FDA Medical Device Surveillance Hub</span>
        <h1>FDA Medical Device Safety & 510(k) Intelligence</h1>
        <p className="lede">
          Multi-year post-market surveillance integrating FDA 510(k) premarket clearances, MAUDE adverse event telemetry, and FDA recall classifications across 8 major therapeutic categories. Snapshot generated {new Date(snapshotMeta.generatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}.
        </p>
      </section>

      <DeviceSignalMatrix devices={devices} deviceMappings={deviceMappings} />

      <LiveDeviceFeed />
    </div>
  );
}
