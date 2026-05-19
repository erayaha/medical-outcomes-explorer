import { StructuredData } from "@/components/structured-data";
import { keywordMap } from "@/lib/site-config";
import { getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "Methods, glossary, and data sources",
  description:
    "Read methodology, licensing notes, API-key requirements, glossary content, and source explanations for the Medical Outcomes Explorer dataset and charts.",
  keywords: keywordMap.methods,
};

export default function MethodsPage() {
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack longform">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Medical Outcomes Explorer methodology",
          license: "https://opensource.org/license/mit",
          dateModified: snapshotMeta.generatedAt,
        }}
      />
      <section className="page-header">
        <p className="eyebrow">Methods & Data</p>
        <h1>Methods, glossary, licensing, and data limitations</h1>
        <p className="lede">
          This page documents the exact government datasets used in the committed snapshot, including API-key requirements and how the static export stays GitHub Pages compatible.
        </p>
      </section>
      <section className="panel stack-gap">
        <h2>Snapshot methodology</h2>
        <p>Medical Outcomes Explorer uses build-time data refreshes to store a committed snapshot of real CMS and openFDA records under <code>/data/2026-05</code>. The frontend only reads those versioned files at render time, so the published site remains fully static.</p>
        <p>The hospital routes currently track three hospitals and combine current CMS facility records with current CMS program files for complications, readmissions, HRRP, HACRP, and HVBP. Device routes currently track three openFDA product codes and aggregate yearly 510(k), adverse-event, and recall counts.</p>
      </section>
      <section className="panel stack-gap">
        <h2>Government data sources</h2>
        <ul>
          <li><a href={snapshotMeta.sourceCatalog.general}>CMS Hospital General Information</a></li>
          <li><a href={snapshotMeta.sourceCatalog.complications}>CMS Complications and Deaths - Hospital</a></li>
          <li><a href={snapshotMeta.sourceCatalog.readmissions}>CMS Unplanned Hospital Visits - Hospital</a></li>
          <li><a href={snapshotMeta.sourceCatalog.hrrp}>CMS Hospital Readmissions Reduction Program</a></li>
          <li><a href={snapshotMeta.sourceCatalog.hac}>CMS HAC Reduction Program</a></li>
          <li><a href={snapshotMeta.sourceCatalog.hvbp}>CMS HVBP Clinical Outcomes</a></li>
          <li><a href={snapshotMeta.sourceCatalog.openFda510k}>openFDA device 510(k)</a></li>
          <li><a href={snapshotMeta.sourceCatalog.openFdaEvent}>openFDA device adverse events</a></li>
          <li><a href={snapshotMeta.sourceCatalog.openFdaRecall}>openFDA device recalls</a></li>
        </ul>
      </section>
      <section className="panel stack-gap">
        <h2>API keys</h2>
        <p>CMS Provider Data Catalog endpoints used here do not require an API key. openFDA also works without an API key for the current usage pattern. The refresh script supports an optional <code>OPENFDA_API_KEY</code> environment variable to raise rate limits, but the committed snapshot was generated without one.</p>
      </section>
      <section className="panel stack-gap">
        <h2>Glossary</h2>
        <h3>HRRP</h3>
        <p>The Hospital Readmissions Reduction Program publishes expected, predicted, and excess readmission values for target conditions.</p>
        <h3>HACRP</h3>
        <p>The Hospital-Acquired Condition Reduction Program publishes infection standardized infection ratios and a total HAC score.</p>
        <h3>HVBP</h3>
        <p>The Hospital Value-Based Purchasing clinical outcomes file publishes baseline and performance rates for mortality and complication-related measures.</p>
      </section>
      <section className="panel stack-gap">
        <h2>Licensing and disclaimers</h2>
        <p>CMS and FDA records linked here are public government data. The repository code is MIT licensed, while the underlying datasets remain governed by their original public data terms.</p>
        <p>This project does not provide medical advice and does not represent official CMS or FDA interpretation.</p>
      </section>
    </div>
  );
}
