import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { TrendChart } from "@/components/trend-chart";
import { getHospitalBySlug, getHospitals } from "@/lib/site-data";

export function generateStaticParams() {
  return getHospitals().map((hospital) => ({ slug: hospital.slug }));
}

export function generateMetadata({ params }) {
  const hospital = getHospitalBySlug(params.slug);

  if (!hospital) {
    return {};
  }

  return {
    title: `${hospital.name} outcomes and CMS quality summary`,
    description: `Explore ${hospital.name} in ${hospital.city}, ${hospital.state}, including CMS-style ratings, outcomes, and hospital program participation.`,
  };
}

export default function HospitalDetailPage({ params }) {
  const hospital = getHospitalBySlug(params.slug);

  if (!hospital) {
    notFound();
  }

  return (
    <div className="container page-stack">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          name: hospital.name,
          identifier: hospital.providerId,
          address: {
            "@type": "PostalAddress",
            addressLocality: hospital.city,
            addressRegion: hospital.state,
            addressCountry: "US",
          },
        }}
      />
      <section className="page-header">
        <p className="eyebrow">Hospital detail</p>
        <h1>{hospital.name}</h1>
        <p className="lede">{hospital.summary}</p>
      </section>
      <section className="grid-two">
        <div className="panel stack-gap">
          <h2>Facility snapshot</h2>
          <dl className="stats-grid">
            <div><dt>CMS provider ID</dt><dd>{hospital.providerId}</dd></div>
            <div><dt>Overall rating</dt><dd>{hospital.overallRating}/5</dd></div>
            <div><dt>Hospital type</dt><dd>{hospital.hospitalType}</dd></div>
            <div><dt>Ownership</dt><dd>{hospital.ownership}</dd></div>
            <div><dt>Teaching status</dt><dd>{hospital.teachingStatus}</dd></div>
            <div><dt>Emergency services</dt><dd>{hospital.emergencyServices ? "Available" : "Not listed"}</dd></div>
          </dl>
        </div>
        <div className="panel stack-gap">
          <h2>Programs and interpretation</h2>
          <ul className="tag-list">
            {hospital.programs.map((program) => (
              <li key={program}>{program}</li>
            ))}
          </ul>
          <p>
            Use this page to compare a single hospital’s mortality, readmissions, complications, and patient experience trends across reporting periods. These are facility-level, descriptive signals and not patient-level estimates.
          </p>
        </div>
      </section>
      <section className="grid-two">
        <TrendChart title="30-day mortality" series={hospital.metrics} dataKey="mortality" />
        <TrendChart title="30-day readmissions" series={hospital.metrics} dataKey="readmissions" color="#2563eb" />
        <TrendChart title="Complications" series={hospital.metrics} dataKey="complications" color="#dc2626" />
        <TrendChart title="Patient experience" series={hospital.metrics} dataKey="patientExperience" color="#ca8a04" />
      </section>
    </div>
  );
}
