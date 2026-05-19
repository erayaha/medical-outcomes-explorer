import { keywordMap } from "@/lib/site-config";
import { getInterventionPrograms } from "@/lib/site-data";

export const metadata = {
  title: "Hospital intervention and program impact explorer",
  description:
    "Review real FY2026 HRRP, HVBP, and HACRP metrics using public CMS program files and explanatory content.",
  keywords: keywordMap.interventions,
};

export default function InterventionsPage() {
  const programs = getInterventionPrograms();

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Interventions</p>
        <h1>CMS program intervention metrics for HRRP, HVBP, and HACRP</h1>
        <p className="lede">
          Instead of synthetic before-and-after estimates, this page uses real CMS program fields from FY2026 public files for the tracked hospitals.
        </p>
      </section>
      <section className="panel stack-gap">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th>Hospitals in sample</th>
                <th>Metric 1</th>
                <th>Value</th>
                <th>Metric 2</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.id}</td>
                  <td>{program.hospitals}</td>
                  <td>{program.firstLabel}</td>
                  <td>{program.firstValue ?? "n/a"}</td>
                  <td>{program.secondLabel}</td>
                  <td>{program.secondValue ?? "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="grid-three">
        {programs.map((program) => (
          <article key={program.id} className="panel stack-gap">
            <h2>{program.title}</h2>
            <p>{program.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
