import { StructuredData } from "@/components/structured-data";
import { keywordMap } from "@/lib/site-config";

export const metadata = {
  title: "Methods, glossary, and data sources",
  description:
    "Read methodology, licensing notes, glossary content, and source explanations for the Medical Outcomes Explorer dataset and charts.",
  keywords: keywordMap.methods,
};

export default function MethodsPage() {
  return (
    <div className="container page-stack longform">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Medical Outcomes Explorer methodology",
          license: "https://opensource.org/license/mit",
        }}
      />
      <section className="page-header">
        <p className="eyebrow">Methods & Data</p>
        <h1>Methods, glossary, licensing, and data limitations</h1>
        <p className="lede">
          This long-form page targets high-intent searches such as “CMS hospital readmission rates explained” and “FDA 510k device clearance data” while documenting how the static site is assembled.
        </p>
      </section>
      <section className="panel stack-gap">
        <h2>Methodology</h2>
        <p>Medical Outcomes Explorer is built as a static site that pre-renders pages from versioned JSON snapshots stored in the repository. The current starter snapshot is intentionally small, but the file structure and scheduled workflows are designed for larger periodic CMS and FDA refreshes.</p>
        <p>Hospital pages use CMS provider identifiers, product pages use FDA product codes, and any device-to-outcome relationship is clearly labeled as heuristic and exploratory. No patient-level records are stored or processed.</p>
      </section>
      <section className="panel stack-gap">
        <h2>Data sources</h2>
        <ul>
          <li>CMS Provider Data Catalog for hospital metadata and current quality context.</li>
          <li>CMS Hospitals Data Archive concepts for time-series and intervention framing.</li>
          <li>openFDA device 510(k), adverse-event, and recall endpoints for product-level context.</li>
          <li>AHRQ Quality Indicators and toolkits for definitions and plain-language interpretation.</li>
        </ul>
      </section>
      <section className="panel stack-gap">
        <h2>Glossary</h2>
        <h3>HRRP</h3>
        <p>The Hospital Readmissions Reduction Program is a CMS payment policy context often used when discussing avoidable readmissions and care transitions.</p>
        <h3>HACRP</h3>
        <p>The Hospital-Acquired Condition Reduction Program highlights patient safety and complication-related performance categories.</p>
        <h3>510(k)</h3>
        <p>FDA 510(k) clearance refers to a premarket pathway showing a new device is substantially equivalent to a legally marketed predicate device.</p>
      </section>
      <section className="panel stack-gap">
        <h2>Licensing and disclaimers</h2>
        <p>CMS and AHRQ resources referenced here are public/open government materials, and openFDA is a public API. The code in this repository is MIT licensed.</p>
        <p>This project does not provide medical advice and does not represent official CMS, FDA, or AHRQ interpretations.</p>
      </section>
    </div>
  );
}
