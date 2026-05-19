import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import HospitalsPage from '@/app/hospitals/page';
import OutcomesOverTimePage from '@/app/outcomes-over-time/page';
import InterventionsPage from '@/app/interventions/page';
import DevicesPage from '@/app/devices-fda/page';
import AdverseEventsPage from '@/app/adverse-events/page';
import MethodsPage from '@/app/methods-data/page';
import EIAPage from '@/app/eia/page';
import HospitalDetailPage from '@/app/hospitals/[slug]/page';
import DeviceDetailPage from '@/app/devices-fda/[productCode]/page';

jest.mock('@/components/live-device-feed', () => ({
  LiveDeviceFeed: function LiveDeviceFeed() {
    return <div>Mock LiveDeviceFeed</div>;
  },
}));

describe('core pages', () => {
  test('home page renders real-data positioning', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /medical outcomes explorer/i })).toBeInTheDocument();
    expect(screen.getByText(/real CMS hospital quality records/i)).toBeInTheDocument();
  });

  test('hospitals page renders tracked provider content', () => {
    render(<HospitalsPage />);
    expect(screen.getByRole('heading', { name: /search tracked CMS hospitals/i })).toBeInTheDocument();
    expect(screen.getAllByText(/provider id/i).length).toBeGreaterThan(0);
  });

  test('outcomes page renders CMS comparison copy', () => {
    render(<OutcomesOverTimePage />);
    expect(screen.getByRole('heading', { name: /CMS outcomes across baseline/i })).toBeInTheDocument();
  });

  test('interventions page renders real program metrics', () => {
    render(<InterventionsPage />);
    expect(screen.getByRole('heading', { name: /CMS program intervention metrics/i })).toBeInTheDocument();
    expect(screen.getAllByText(/HRRP/).length).toBeGreaterThan(0);
  });

  test('device pages render FDA data', () => {
    render(<DevicesPage />);
    expect(screen.getByRole('heading', { name: /Explore tracked FDA 510\(k\), recall, and adverse-event timelines/i })).toBeInTheDocument();
    render(<AdverseEventsPage />);
    expect(screen.getByRole('heading', { name: /Adverse event and recall explorer/i })).toBeInTheDocument();
  });

  test('methods and eia pages render data-source text', () => {
    render(<MethodsPage />);
    expect(screen.getByText(/API keys/)).toBeInTheDocument();
    render(<EIAPage />);
    expect(screen.getByRole('heading', { name: /Standalone explorer for hospital outcomes and device intelligence/i })).toBeInTheDocument();
  });

  test('detail pages render tracked hospital and device routes', () => {
    render(<HospitalDetailPage params={{ slug: '330214-nyu-langone-hospitals' }} />);
    expect(screen.getByRole('heading', { name: /NYU LANGONE HOSPITALS/i })).toBeInTheDocument();
    render(<DeviceDetailPage params={{ productCode: 'FRN' }} />);
    expect(screen.getByText(/Latest 510\(k\):/i)).toBeInTheDocument();
  });
});
