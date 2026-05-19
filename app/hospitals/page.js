import { HospitalExplorer } from "@/components/hospital-explorer";
import { StructuredData } from "@/components/structured-data";
import { keywordMap } from "@/lib/site-config";
import { getHospitals } from "@/lib/site-data";

export const metadata = {
  title: "Hospital quality and outcomes explorer",
  description:
    "Browse searchable CMS-style hospital outcome pages by state, rating, ownership, and facility type.",
  keywords: keywordMap.hospitals,
};

export default function HospitalsPage() {
  const hospitals = getHospitals();

  return (
    <div className="container page-stack">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Medical Outcomes Explorer hospital pages",
          about: "CMS hospital quality data",
        }}
      />
      <section className="page-header">
        <p className="eyebrow">Hospitals</p>
        <h1>Search US hospitals by outcomes, ownership, and rating</h1>
        <p className="lede">
          This static directory is optimized for crawlability, with a filterable table, linked detail pages, and a snapshot map for quick comparison.
        </p>
      </section>
      <HospitalExplorer hospitals={hospitals} />
    </div>
  );
}
