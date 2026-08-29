import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataExporter } from "@/components/data-exporter";
import { StakeholderPersonaBar, PERSONAS } from "@/components/stakeholder-persona-bar";

const mockHospitals = [
  { providerId: "330214", name: "NYU Langone", city: "New York", state: "NY", overallRating: 5, hospitalType: "Acute Care" },
];

const mockDevices = [
  { productCode: "FRN", deviceClass: "Infusion Pump", medicalSpecialty: "General Hospital", therapeuticArea: "Infusion", eventBreakdown: { deaths: 0, injuries: 5, malfunctions: 10 } },
];

const mockMeasures = [{ id: "mortality", name: "Mortality" }];

describe("DataExporter and StakeholderPersonaBar components", () => {
  test("renders DataExporter buttons and switches format", () => {
    render(<DataExporter hospitals={mockHospitals} devices={mockDevices} measures={mockMeasures} />);

    expect(screen.getByText(/Open Data Export & Research API Workbench/i)).toBeInTheDocument();

    const formatSelect = screen.getByRole("combobox");
    fireEvent.change(formatSelect, { target: { value: "csv" } });

    expect(screen.getByText(/Download Hospital Quality Dataset \(CSV\)/i)).toBeInTheDocument();
  });

  test("triggers downloads for JSON and CSV", () => {
    render(<DataExporter hospitals={mockHospitals} devices={mockDevices} measures={mockMeasures} />);

    const createObjectURLMock = jest.fn(() => "blob:http://localhost/mock");
    const revokeObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    // Download JSON
    fireEvent.click(screen.getByText(/Download Hospital Quality Dataset \(JSON\)/i));
    expect(createObjectURLMock).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Download FDA Device Surveillance \(JSON\)/i));
    fireEvent.click(screen.getByText(/Download Measure Dictionary \(JSON\)/i));

    // Switch to CSV and download
    const formatSelect = screen.getByRole("combobox");
    fireEvent.change(formatSelect, { target: { value: "csv" } });

    fireEvent.click(screen.getByText(/Download Hospital Quality Dataset \(CSV\)/i));
    fireEvent.click(screen.getByText(/Download FDA Device Surveillance \(CSV\)/i));
  });

  test("renders StakeholderPersonaBar and switches active persona", () => {
    render(<StakeholderPersonaBar />);

    expect(screen.getByText("Stakeholder Intelligence Mode")).toBeInTheDocument();

    // Click MedTech tab
    const medtechTab = screen.getByRole("tab", { name: /MedTech & Regulatory Affairs/i });
    fireEvent.click(medtechTab);

    expect(screen.getByText(/Post-Market MAUDE Signals, 510\(k\) Clearances & Recalls/i)).toBeInTheDocument();
  });
});
