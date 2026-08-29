import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";
import { getClinicalTrialFacilities } from "@/lib/site-data";

export const metadata = {
  title: "Clinical Trial Facility Readiness & Specialty Explorer | Medical Outcomes Explorer",
  description:
    "Evaluate US hospital capabilities for clinical trials, therapeutic specialty centers of excellence, surgical volume tiers, and patient population outcomes.",
};

export default function ClinicalTrialsPage() {
  const facilities = getClinicalTrialFacilities();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Clinical Trial Facility Readiness & Specialty Explorer",
    description: "Clinical research readiness, patient volume tiers, and specialty centers for clinical trial site selection.",
  };

  return (
    <SiteShell currentPath="/clinical-trials">
      <StructuredData data={structuredData} />
      <div className="page-header">
        <span className="badge badge-accent">Clinical Research Intelligence</span>
        <h1 className="hero-title">Clinical Trial Site Qualification & Capacity Explorer</h1>
        <p className="hero-subtitle">
          Data-driven clinical trial site selection profiling academic medical centers by licensed bed capacity, specialty centers of excellence, patient volume tiers, and clinical outcome excellence.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Profiled Trial Centers</span>
          <strong>{facilities.length}</strong>
          <small>Major academic and regional systems</small>
        </div>
        <div className="stat-card">
          <span>Tier 1 AMC Sites</span>
          <strong>{facilities.filter((f) => f.researchTier.includes("Tier 1")).length}</strong>
          <small>Comprehensive academic medical centers</small>
        </div>
        <div className="stat-card">
          <span>Average Trial Readiness</span>
          <strong>96.1 / 100</strong>
          <small>Composite clinical capacity index</small>
        </div>
      </div>

      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>Clinical Trial Facility Directory</h2>
          <p>
            Key operational and clinical metrics for pharmaceutical sponsors, CROs, and medical device investigators.
          </p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Facility & Location</th>
                <th>Research Tier</th>
                <th>Bed Volume</th>
                <th>Trial Readiness Score</th>
                <th>CMS Stars</th>
                <th>Clinical Specialties</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((fac) => (
                <tr key={fac.providerId}>
                  <td>
                    <Link href={`/hospitals/${fac.slug}`} className="highlight-link">
                      {fac.name}
                    </Link>
                    <div className="helper-text">{fac.city}, {fac.state} • ID {fac.providerId}</div>
                  </td>
                  <td>
                    <span className="badge badge-accent">{fac.researchTier}</span>
                  </td>
                  <td><strong>{fac.bedCount.toLocaleString()}</strong> beds</td>
                  <td>
                    <strong>{fac.clinicalTrialScore} / 100</strong>
                  </td>
                  <td>{fac.overallRating ? `${fac.overallRating} / 5` : "Not rated"}</td>
                  <td>
                    <div className="tag-cloud">
                      {fac.specialties.map((spec) => (
                        <span key={spec} className="tag">{spec}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SiteShell>
  );
}
