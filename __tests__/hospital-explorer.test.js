import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HospitalExplorer } from '@/components/hospital-explorer';

const mockHospitals = [
  {
    providerId: '330214',
    slug: '330214-nyu-langone-hospitals',
    name: 'NYU LANGONE HOSPITALS',
    city: 'NEW YORK',
    state: 'NY',
    hospitalType: 'Acute Care Hospitals',
    overallRating: 5,
    programs: ['HRRP', 'HVBP', 'HACRP'],
  },
  {
    providerId: '050425',
    slug: '050425-kaiser-foundation-hospital-sacramento',
    name: 'KAISER FOUNDATION HOSPITAL - SACRAMENTO',
    city: 'SACRAMENTO',
    state: 'CA',
    hospitalType: 'Acute Care Hospitals',
    overallRating: 4,
    programs: ['HRRP', 'HVBP'],
  },
  {
    providerId: '450193',
    slug: '450193-baylor-st-lukes-medical-center',
    name: "BAYLOR ST. LUKE'S MEDICAL CENTER",
    city: 'HOUTON',
    state: 'TX',
    hospitalType: 'Acute Care Hospitals',
    overallRating: null,
    programs: ['HRRP'],
  },
];

describe('HospitalExplorer component', () => {
  test('renders all hospital rows and state summary by default', () => {
    render(<HospitalExplorer hospitals={mockHospitals} />);

    expect(screen.getByText('NYU LANGONE HOSPITALS')).toBeInTheDocument();
    expect(screen.getByText('KAISER FOUNDATION HOSPITAL - SACRAMENTO')).toBeInTheDocument();
    expect(screen.getByText("BAYLOR ST. LUKE'S MEDICAL CENTER")).toBeInTheDocument();

    expect(screen.getByText('State snapshot')).toBeInTheDocument();
    expect(screen.getAllByText('NY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CA').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TX').length).toBeGreaterThanOrEqual(1);
  });

  test('filters hospital list when searching by name', () => {
    render(<HospitalExplorer hospitals={mockHospitals} />);

    const searchInput = screen.getByPlaceholderText(/Search by hospital, city, or CMS provider ID/i);
    fireEvent.change(searchInput, { target: { value: 'Langone' } });

    expect(screen.getByText('NYU LANGONE HOSPITALS')).toBeInTheDocument();
    expect(screen.queryByText('KAISER FOUNDATION HOSPITAL - SACRAMENTO')).not.toBeInTheDocument();
    expect(screen.queryByText("BAYLOR ST. LUKE'S MEDICAL CENTER")).not.toBeInTheDocument();
  });

  test('filters hospital list when searching by provider ID', () => {
    render(<HospitalExplorer hospitals={mockHospitals} />);

    const searchInput = screen.getByPlaceholderText(/Search by hospital, city, or CMS provider ID/i);
    fireEvent.change(searchInput, { target: { value: '050425' } });

    expect(screen.getByText('KAISER FOUNDATION HOSPITAL - SACRAMENTO')).toBeInTheDocument();
    expect(screen.queryByText('NYU LANGONE HOSPITALS')).not.toBeInTheDocument();
  });

  test('filters hospital list by selected state', () => {
    render(<HospitalExplorer hospitals={mockHospitals} />);

    const stateSelect = screen.getByRole('combobox');
    fireEvent.change(stateSelect, { target: { value: 'CA' } });

    expect(screen.getByText('KAISER FOUNDATION HOSPITAL - SACRAMENTO')).toBeInTheDocument();
    expect(screen.queryByText('NYU LANGONE HOSPITALS')).not.toBeInTheDocument();
    expect(screen.queryByText("BAYLOR ST. LUKE'S MEDICAL CENTER")).not.toBeInTheDocument();
  });

  test('displays "Not rated" when overallRating is null', () => {
    render(<HospitalExplorer hospitals={mockHospitals} />);

    expect(screen.getByText('Not rated')).toBeInTheDocument();
    expect(screen.getByText('5/5')).toBeInTheDocument();
    expect(screen.getByText('4/5')).toBeInTheDocument();
  });
});
