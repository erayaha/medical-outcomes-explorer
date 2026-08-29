import React from 'react';
import { render } from '@testing-library/react';
import { StructuredData } from '@/components/structured-data';

describe('StructuredData component', () => {
  test('renders application/ld+json script tag with valid JSON payload', () => {
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: 'NYU Langone Hospitals',
      url: 'https://erayaha.github.io/medical-outcomes-explorer/hospitals/330214-nyu-langone-hospitals',
    };

    const { container } = render(<StructuredData data={payload} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();
    expect(JSON.parse(script.innerHTML)).toEqual(payload);
  });
});
