import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";

export const metadata = {
  title: "About Medical Outcomes Explorer | Open Healthcare Intelligence",
  description:
    "Learn about the mission, data architecture, and open science standards behind Medical Outcomes Explorer.",
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Medical Outcomes Explorer",
    url: "https://erayaha.github.io/medical-outcomes-explorer/about/",
    mainEntity: {
      "@type": "Organization",
      "name": "Erayaha",
      "url": "https://github.com/erayaha",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "email": "contact@erayaha.org",
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
      },
    },
  };

  return (
    <SiteShell currentPath="/about">
      <StructuredData data={structuredData} />
      <div className="page-header">
        <span className="badge badge-accent">Open Health Informatics</span>
        <h1 className="hero-title">About Medical Outcomes Explorer</h1>
        <p className="hero-subtitle">
          Democratizing public healthcare quality datasets, clinical outcomes benchmarks, and medical device post-market surveillance.
        </p>
      </div>

      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>Our Mission</h2>
          <p>
            Medical Outcomes Explorer was created by Erayaha to provide a transparent, accessible, and high-performance portal for exploring federal healthcare datasets. We believe that clinical outcomes, hospital safety metrics, and medical device regulatory histories should be freely discoverable by all stakeholders—from hospital quality officers and medtech regulatory teams to academic epidemiologists and patient advocacy groups.
          </p>
        </div>

        <div className="section-heading">
          <h2>Data Sourcing & Integrity</h2>
          <p>
            All clinical metrics displayed in this portal are sourced directly from authoritative US Federal Government data repositories, including the Centers for Medicare & Medicaid Services (CMS Provider Data) and the Food and Drug Administration (openFDA). Our platform strictly avoids synthetic interpolations or proprietary black-box scoring, ensuring that every data point remains 100% traceable to government reporting files.
          </p>
        </div>

        <div className="section-heading">
          <h2>Open Source Architecture</h2>
          <p>
            Medical Outcomes Explorer is built as a fully static, pre-rendered Next.js web application released under the open-source MIT License. By pre-rendering all data routes, we achieve near-instantaneous page load times, full search engine discoverability, and zero runtime server vulnerabilities.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
