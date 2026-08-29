import { HospitalComparator } from "@/components/hospital-comparator";
import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";
import { getHospitals } from "@/lib/site-data";

export const metadata = {
  title: "Multi-Hospital Quality & Risk Benchmark Comparator | Medical Outcomes Explorer",
  description:
    "Interactive side-by-side hospital quality comparator. Benchmark 30-day mortality, HRRP readmission penalty ratios, HAC infection SIRs, and CMS overall star ratings.",
};

export default function ComparePage() {
  const hospitals = getHospitals();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Multi-Hospital Quality Comparator",
    description: "Side-by-side benchmark tool for US hospital quality, readmissions, and patient safety indicators.",
    about: hospitals.map((h) => ({
      "@type": "MedicalOrganization",
      name: h.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: h.city,
        addressRegion: h.state,
      },
    })),
  };

  return (
    <SiteShell currentPath="/compare">
      <StructuredData data={structuredData} />
      <div className="page-header">
        <span className="badge badge-accent">Interactive Quality Benchmarking</span>
        <h1 className="hero-title">Hospital Quality & Penalty Risk Comparator</h1>
        <p className="hero-subtitle">
          Direct side-by-side comparison of clinical outcomes, readmission ratios (HRRP), infection standardized infection ratios (HACRP), and value-based purchasing measures across premier US health systems.
        </p>
      </div>

      <HospitalComparator hospitals={hospitals} />
    </SiteShell>
  );
}
