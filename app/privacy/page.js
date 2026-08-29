import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";

export const metadata = {
  title: "Privacy Policy | Medical Outcomes Explorer",
  description:
    "Privacy policy and data governance standards for the Medical Outcomes Explorer open platform.",
};

export default function PrivacyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: "https://erayaha.github.io/medical-outcomes-explorer/privacy/",
    publisher: {
      "@type": "Organization",
      "name": "Erayaha",
      "url": "https://github.com/erayaha",
    },
  };

  return (
    <SiteShell currentPath="/privacy">
      <StructuredData data={structuredData} />
      <div className="page-header">
        <span className="badge badge-accent">Data Governance</span>
        <h1 className="hero-title">Privacy Policy & Data Ethics</h1>
        <p className="hero-subtitle">
          Our commitment to zero personal health data collection, open data governance, and complete visitor privacy.
        </p>
      </div>

      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>No Protected Health Information (PHI)</h2>
          <p>
            Medical Outcomes Explorer exclusively processes and displays aggregate, facility-level, and product-level public datasets released by the United States Department of Health and Human Services (HHS), CMS, and the FDA. This platform does not ingest, store, transmit, or process any individual Protected Health Information (PHI) or Personally Identifiable Information (PII) subject to HIPAA.
          </p>
        </div>

        <div className="section-heading">
          <h2>Zero Visitor Tracking & No Commercial Cookies</h2>
          <p>
            We respect your privacy. Medical Outcomes Explorer operates with zero third-party advertising trackers, zero social media tracking pixels, and zero cross-site data brokerage. We do not maintain user accounts, require registration, or monetize visitor usage data.
          </p>
        </div>

        <div className="section-heading">
          <h2>Client-Side Caching & Local Storage</h2>
          <p>
            When you interact with the in-browser live device feed, fresh API responses are cached solely within your local web browser's `localStorage` to reduce redundant government API queries. This cached data never leaves your device and can be cleared at any time through your browser settings.
          </p>
        </div>

        <div className="section-heading">
          <h2>Contact Regarding Privacy</h2>
          <p>
            For privacy inquiries or data governance questions, please contact our data protection team at <a href="mailto:contact@erayaha.org">contact@erayaha.org</a>.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
