import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import RootLayout from '@/app/layout';
import { SiteShell } from '@/components/site-shell';
import { TrendChart } from '@/components/trend-chart';
import { LiveDeviceFeed } from '@/components/live-device-feed';
import { fetchWithLocalCache } from '@/lib/browser-cache';

beforeEach(() => {
  window.localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ui and cache helpers', () => {
  test('root layout and site shell render navigation', () => {
    const layout = RootLayout({ children: <div>Child content</div> });
    expect(layout.type).toBe('html');
    expect(layout.props.children.type).toBe('body');

    render(<SiteShell><div>Inner page</div></SiteShell>);
    expect(screen.getAllByText(/Medical Outcomes Explorer/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Inner page/)).toBeInTheDocument();
    expect(screen.getAllByText(/Hospitals/i).length).toBeGreaterThan(0);
  });

  test('trend chart renders fallback when no values are available', () => {
    render(<TrendChart title="Empty chart" series={[]} />);
    expect(screen.getByText(/No published values are available/i)).toBeInTheDocument();
  });

  test('fetchWithLocalCache caches browser responses', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ results: ['fresh'] }),
    });

    const first = await fetchWithLocalCache('cache-key', 'https://example.com/data');
    const second = await fetchWithLocalCache('cache-key', 'https://example.com/data');

    expect(first).toEqual({ results: ['fresh'] });
    expect(second).toEqual({ results: ['fresh'] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('live device feed loads and refreshes live records', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        results: [
          { k_number: 'K123456', device_name: 'Test Device', applicant: 'FDA Applicant' },
        ],
      }),
    });

    render(<LiveDeviceFeed />);

    expect(screen.getByText(/Loading live openFDA data/i)).toBeInTheDocument();
    expect(await screen.findByText(/Test Device/)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Refresh from source/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
