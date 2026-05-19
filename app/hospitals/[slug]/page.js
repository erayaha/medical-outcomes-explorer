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
    description: `Explore ${hospital.name} in ${hospital.city}, ${hospital.state}, including current CMS ratings, mortality, readmission, complication, and HAC program metrics.`,
  };
}

function renderMeasureRows(rows) {
  return rows.map((row) => (
    <tr key={row.measureId}>
      <td>{row.measureName}</td>
      <td>{row.score ?? "Not available"}</td>
      <td>{row.comparedToNational || "Not available"}</td>
      <td>{row.startDate} – {row.endDate}</td>
    </tr>
  ));
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
            streetAddress: hospital.address,
            addressLocality: hospital.city,
            addressRegion: hospital.state,
            postalCode: hospital.zipCode,
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
            <div><dt>Overall rating</dt><dd>{hospital.overallRating ? `${hospital.overallRating}/5` : "Not rated"}</dd></div>
            <div><dt>Hospital type</dt><dd>{hospital.hospitalType}</dd></div>
            <div><dt>Ownership</dt><dd>{hospital.ownership}</dd></div>
            <div><dt>Emergency services</dt><dd>{hospital.emergencyServices ? "Yes" : "No"}</dd></div>
            <div><dt>Birthing friendly</dt><dd>{hospital.birthingFriendly ? "Yes" : "No"}</dd></div>
          </dl>
        </div>
        <div className="panel stack-gap">
          <h2>CMS quality summary</h2>
          <ul className="tag-list">
            {hospital.programs.map((program) => (
              <li key={program}>{program}</li>
            ))}
          </ul>
          <p>Mortality measures better than national: {hospital.qualityCounts.mortalityBetter}</p>
          <p>Readmission measures better than national: {hospital.qualityCounts.readmissionsBetter}</p>
          <p>Safety measures better than national: {hospital.qualityCounts.safetyBetter}</p>
          <p>HAC payment reduction: {hospital.hacSummary?.paymentReduction || "Not listed"}</p>
        </div>
      </section>
      <section className="grid-two">
        <TrendChart
          title="HVBP mortality domain rate"
          series={hospital.charts.mortality}
          color="#0f766e"
          valueFormatter={(value) => value?.toFixed(4) ?? "n/a"}
        />
        <TrendChart
          title="HRRP expected vs predicted readmission rate"
          series={hospital.charts.readmissions}
          color="#2563eb"
          valueFormatter={(value) => value?.toFixed(2) ?? "n/a"}
        />
        <TrendChart
          title="Current complication score"
          series={hospital.charts.complications}
          color="#dc2626"
          valueFormatter={(value) => value?.toFixed(2) ?? "n/a"}
        />
        <TrendChart
          title="Current HAC total score"
          series={hospital.charts.safety}
          color="#ca8a04"
          valueFormatter={(value) => value?.toFixed(4) ?? "n/a"}
        />
      </section>
      <section className="grid-two">
        <article className="panel stack-gap">
          <h2>Mortality measures</h2>
          <div className="table-wrap"><table><thead><tr><th>Measure</th><th>Score</th><th>Compared to national</th><th>Window</th></tr></thead><tbody>{renderMeasureRows(hospital.mortalityMeasures)}</tbody></table></div>
        </article>
        <article className="panel stack-gap">
          <h2>Readmission measures</h2>
          <div className="table-wrap"><table><thead><tr><th>Measure</th><th>Score</th><th>Compared to national</th><th>Window</th></tr></thead><tbody>{renderMeasureRows(hospital.readmissionMeasures)}</tbody></table></div>
        </article>
      </section>
      <section className="grid-two">
        <article className="panel stack-gap">
          <h2>Complications and safety measures</h2>
          <div className="table-wrap"><table><thead><tr><th>Measure</th><th>Score</th><th>Compared to national</th><th>Window</th></tr></thead><tbody>{renderMeasureRows(hospital.complicationMeasures)}</tbody></table></div>
        </article>
        <article className="panel stack-gap">
          <h2>Program-specific fields</h2>
          <p><strong>HRRP measure:</strong> {hospital.hrrpMeasure?.measureName || "Not available"}</p>
          <p><strong>Excess readmission ratio:</strong> {hospital.hrrpMeasure?.excessReadmissionRatio ?? "Not available"}</p>
          <p><strong>Predicted readmission rate:</strong> {hospital.hrrpMeasure?.predictedReadmissionRate ?? "Not available"}</p>
          <p><strong>Expected readmission rate:</strong> {hospital.hrrpMeasure?.expectedReadmissionRate ?? "Not available"}</p>
          <p><strong>HAC FY:</strong> {hospital.hacSummary?.fiscalYear || "Not available"}</p>
          <p><strong>CLABSI SIR:</strong> {hospital.hacSummary?.clabsiSir ?? "Not available"}</p>
          <p><strong>CAUTI SIR:</strong> {hospital.hacSummary?.cautiSir ?? "Not available"}</p>
          <p><strong>MRSA SIR:</strong> {hospital.hacSummary?.mrsaSir ?? "Not available"}</p>
        </article>
      </section>
    </div>
  );
}
