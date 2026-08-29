import React from "react";
import { render, screen } from "@testing-library/react";
import ClinicalTrialsPage from "@/app/clinical-trials/page";
import { getClinicalTrialFacilities } from "@/lib/site-data";

describe("Clinical Trials Page & Intelligence", () => {
  test("getClinicalTrialFacilities returns ranked facilities with research scores", () => {
    const facilities = getClinicalTrialFacilities();
    expect(facilities.length).toBeGreaterThanOrEqual(3);

    const first = facilities[0];
    expect(first).toHaveProperty("providerId");
    expect(first).toHaveProperty("clinicalTrialScore");
    expect(first).toHaveProperty("researchTier");
    expect(first).toHaveProperty("bedCount");
    expect(first).toHaveProperty("specialties");
  });

  test("renders ClinicalTrialsPage with site qualification stats and directory", () => {
    render(<ClinicalTrialsPage />);

    expect(screen.getByText("Clinical Trial Site Qualification & Capacity Explorer")).toBeInTheDocument();
    expect(screen.getByText("Profiled Trial Centers")).toBeInTheDocument();
    expect(screen.getByText("Tier 1 AMC Sites")).toBeInTheDocument();
  });
});
