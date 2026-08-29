"use client";

import { useState } from "react";

export const PERSONAS = [
  {
    id: "quality",
    name: "Hospital Leadership & Quality",
    icon: "🏥",
    tagline: "HRRP Penalties, HAC Infection SIRs & HVBP Domain Baselines",
    focus: [
      "Projected HRRP Medicare readmission penalties and excess ratios",
      "HACRP infection standardized ratios (CLABSI, CAUTI, SSI, CDI, MRSA)",
      "HVBP clinical outcomes domain improvement baselines",
    ],
  },
  {
    id: "medtech",
    name: "MedTech & Regulatory Affairs",
    icon: "🔬",
    tagline: "Post-Market MAUDE Signals, 510(k) Clearances & Recalls",
    focus: [
      "MAUDE adverse event risk tracking (Deaths vs Injuries vs Malfunctions)",
      "FDA Class I/II/III recall surveillance and root-cause classifications",
      "510(k) clearance velocity and predicate evolution across 8 therapeutic areas",
    ],
  },
  {
    id: "research",
    name: "Academics & Epidemiologists",
    icon: "📊",
    tagline: "Longitudinal Clinical Trends, Confidence Intervals & Raw Data",
    focus: [
      "Risk-adjusted 30-day mortality (AMI, HF, PN, STK, CABG) distributions",
      "Excess Days in Acute Care (EDAC-30) return day dispersion",
      "Open data export in CSV & JSON format with government API provenance",
    ],
  },
  {
    id: "trials",
    name: "Clinical Trial Sponsors & CROs",
    icon: "🧪",
    tagline: "Site Selection, Patient Volume & Specialty Excellence Profiling",
    focus: [
      "Academic medical center research tiering and bed volume profiling",
      "Surgical complication benchmarks for therapeutic site qualification",
      "Device innovation adoption timelines and clinical trial readiness scores",
    ],
  },
];

export function StakeholderPersonaBar() {
  const [activePersona, setActivePersona] = useState(PERSONAS[0].id);
  const current = PERSONAS.find((p) => p.id === activePersona) || PERSONAS[0];

  return (
    <div className="persona-card">
      <div className="persona-header">
        <div>
          <span className="badge badge-accent">Stakeholder Intelligence Mode</span>
          <h2 className="heading-lg">Tailored Clinical Analytics & Decision Support</h2>
        </div>
      </div>
      <div className="persona-tabs" role="tablist">
        {PERSONAS.map((persona) => {
          const isActive = persona.id === activePersona;
          return (
            <button
              key={persona.id}
              role="tab"
              aria-selected={isActive}
              className={`persona-tab ${isActive ? "persona-tab-active" : ""}`}
              onClick={() => setActivePersona(persona.id)}
            >
              <span className="persona-icon">{persona.icon}</span>
              <span className="persona-name">{persona.name}</span>
            </button>
          );
        })}
      </div>
      <div className="persona-body">
        <div className="persona-highlight">
          <strong>{current.tagline}</strong>
          <ul className="persona-focus-list">
            {current.focus.map((item, idx) => (
              <li key={idx}>✓ {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
