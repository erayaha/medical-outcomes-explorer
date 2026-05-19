import { keywordMap } from "@/lib/site-config";
import { getHospitals } from "@/lib/site-data";

export const metadata = {
  title: "Hospital intervention and program impact explorer",
  description:
    "Review HRRP, HVBP, and HACRP before-and-after outcome trends using static, source-linked explanatory content.",
  keywords: keywordMap.interventions,
};

export default function InterventionsPage() {
  const hospitals = getHospitals();
  const programs = ["HRRP", "HVBP", "HACRP"]
    .map((program) => {
      const participants = hospitals.filter((hospital) => hospital.programs.includes(program));
      if (!participants.length) {
        return null;
      }
      return {
        program,
        participants: participants.length,
        readmissionsBefore: (participants.reduce((sum, hospital) => sum + hospital.metrics[0].readmissions, 0) / participants.length).toFixed(1),
        readmissionsAfter: (participants.reduce((sum, hospital) => sum + hospital.metrics.at(-1).readmissions, 0) / participants.length).toFixed(1),
        complicationsBefore: (participants.reduce((sum, hospital) => sum + hospital.metrics[0].complications, 0) / participants.length).toFixed(1),
        complicationsAfter: (participants.reduce((sum, hospital) => sum + hospital.metrics.at(-1).complications, 0) / participants.length).toFixed(1),
      };
    })
    .filter(Boolean);

  return (
    <div className="container page-stack">
      <section className="page-header">
        <p className="eyebrow">Interventions</p>
        <h1>Program intervention trends for HRRP, HVBP, and HACRP</h1>
        <p className="lede">
          This starter build uses the archived-style snapshot to summarize before-and-after differences for participating hospitals and explain how the programs relate to publicly reported outcomes.
        </p>
      </section>
      <section className="panel stack-gap">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th>Hospitals in sample</th>
                <th>Readmissions 2022</th>
                <th>Readmissions 2024</th>
                <th>Complications 2022</th>
                <th>Complications 2024</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.program}>
                  <td>{program.program}</td>
                  <td>{program.participants}</td>
                  <td>{program.readmissionsBefore}%</td>
                  <td>{program.readmissionsAfter}%</td>
                  <td>{program.complicationsBefore}%</td>
                  <td>{program.complicationsAfter}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="grid-three">
        <article className="panel"><h2>HRRP</h2><p>The Hospital Readmissions Reduction Program is shown here through directional readmission trends only.</p></article>
        <article className="panel"><h2>HVBP</h2><p>Hospital Value-Based Purchasing context helps explain how incentives can align with broader quality movement.</p></article>
        <article className="panel"><h2>HACRP</h2><p>The Hospital-Acquired Condition Reduction Program is framed around complication-oriented interpretation.</p></article>
      </section>
    </div>
  );
}
