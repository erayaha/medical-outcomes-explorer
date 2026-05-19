import { HospitalExplorer } from "@/components/hospital-explorer";
import { StructuredData } from "@/components/structured-data";
import { keywordMap } from "@/lib/site-config";
import { getHospitals, getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "Hospital quality and outcomes explorer",
  description:
    "Browse searchable CMS hospital records by state, rating, ownership, and provider type using current government data.",
  keywords: keywordMap.hospitals,
};

export default function HospitalsPage() {
  const hospitals = getHospitals();
  const snapshotMeta = getSnapshotMeta();

  return (
    <div className="container page-stack">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Medical Outcomes Explorer hospital pages",
          about: "CMS hospital quality data",
          dateModified: snapshotMeta.generatedAt,
        }}
      />
      <section className="page-header">
        <p className="eyebrow">Hospitals</p>
        <h1>Search tracked CMS hospitals by outcomes, ownership, and rating</h1>
        <p className="lede">
          This directory is built from real CMS Provider Data Catalog records and links to detail pages that summarize current mortality, readmission, complication, and HAC program fields.
        </p>
      </section>
      <HospitalExplorer hospitals={hospitals} />
    </div>
  );
}
