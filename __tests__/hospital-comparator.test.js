import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { HospitalComparator } from "@/components/hospital-comparator";

const mockHospitals = [
  {
    providerId: "330214",
    slug: "330214-nyu-langone-hospitals",
    name: "NYU LANGONE HOSPITALS",
    city: "NEW YORK",
    state: "NY",
    overallRating: 5,
    bedCount: 1100,
    clinicalTrialScore: 98,
    researchTier: "Tier 1 - Comprehensive Academic Medical Center",
    specialties: ["Cardiac Surgery", "Orthopedics"],
    hrrpMeasure: {
      excessReadmissionRatio: 0.8765,
      predictedReadmissionRate: 17.2,
      expectedReadmissionRate: 19.6,
      penaltyStatus: "Exempt / No Penalty",
    },
    hacSummary: {
      totalHacScore: -0.84,
      paymentReduction: "No",
      clabsiSir: 0.32,
      cautiSir: 0.41,
    },
    complicationMeasures: [{ score: 1.6, comparedToNational: "Better Than National" }],
  },
  {
    providerId: "360180",
    slug: "360180-cleveland-clinic",
    name: "CLEVELAND CLINIC",
    city: "CLEVELAND",
    state: "OH",
    overallRating: 5,
    bedCount: 1400,
    clinicalTrialScore: 99,
    researchTier: "Tier 1 - Comprehensive Academic Medical Center",
    specialties: ["Heart & Vascular Institute"],
    hrrpMeasure: {
      excessReadmissionRatio: 0.892,
      predictedReadmissionRate: 16.4,
      expectedReadmissionRate: 18.4,
      penaltyStatus: "Exempt / No Penalty",
    },
    hacSummary: {
      totalHacScore: -0.76,
      paymentReduction: "No",
      clabsiSir: 0.38,
      cautiSir: 0.44,
    },
    complicationMeasures: [{ score: 1.7, comparedToNational: "Better Than National" }],
  },
  {
    providerId: "450193",
    slug: "450193-baylor-st-lukes-medical-center",
    name: "BAYLOR ST. LUKE'S MEDICAL CENTER",
    city: "HOUSTON",
    state: "TX",
    overallRating: 3,
    bedCount: 850,
    clinicalTrialScore: 92,
    researchTier: "Tier 1 - Comprehensive Academic Medical Center",
    specialties: ["Texas Heart Institute"],
    hrrpMeasure: {
      excessReadmissionRatio: 1.042,
      predictedReadmissionRate: 21.2,
      expectedReadmissionRate: 20.3,
      penaltyStatus: "Penalty Risk (Ratio > 1.0)",
    },
    hacSummary: {
      totalHacScore: 0.24,
      paymentReduction: "No",
      clabsiSir: 0.74,
      cautiSir: 0.82,
    },
    complicationMeasures: [{ score: 2.4, comparedToNational: "Average" }],
  },
];

describe("HospitalComparator component", () => {
  test("renders comparison table with default selected hospitals", () => {
    render(<HospitalComparator hospitals={mockHospitals} />);

    expect(screen.getAllByText("NYU LANGONE HOSPITALS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("CLEVELAND CLINIC").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Select Hospitals to Benchmark (Up to 3)")).toBeInTheDocument();
    expect(screen.getByText("0.8765")).toBeInTheDocument();
  });

  test("toggles hospital selection when clicking chips", () => {
    render(<HospitalComparator hospitals={mockHospitals} />);

    // Click Baylor St. Luke's chip to add to comparison
    const baylorChip = screen.getByRole("button", { name: /BAYLOR ST. LUKE'S MEDICAL CENTER/i });
    fireEvent.click(baylorChip);

    expect(screen.getAllByText("BAYLOR ST. LUKE'S MEDICAL CENTER").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("1.0420")).toBeInTheDocument();
  });

  test("exports comparison to CSV when clicking export button", () => {
    render(<HospitalComparator hospitals={mockHospitals} />);

    const exportBtn = screen.getByRole("button", { name: /Export Comparison Matrix/i });
    expect(exportBtn).toBeInTheDocument();

    // Mock URL and click
    const createObjectURLMock = jest.fn(() => "blob:http://localhost/mock");
    const revokeObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    fireEvent.click(exportBtn);
    expect(createObjectURLMock).toHaveBeenCalled();
  });
});
