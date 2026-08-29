import fs from 'node:fs';
import path from 'node:path';

describe('Static Export E2E Integrity', () => {
  const outDir = path.join(process.cwd(), 'out');

  beforeAll(() => {
    // Build static export to ensure ./out is fresh
    const { execSync } = require('node:child_process');
    execSync('yarn build', {
      env: {
        ...process.env,
        PAGES_BASE_PATH: '/medical-outcomes-explorer',
        SITE_URL: 'https://erayaha.github.io/medical-outcomes-explorer',
      },
      stdio: 'pipe',
    });
  });

  const expectedRoutes = [
    'index.html',
    'compare/index.html',
    'clinical-trials/index.html',
    'research-api/index.html',
    'hospitals/index.html',
    'hospitals/330214-nyu-langone-hospitals/index.html',
    'hospitals/360180-cleveland-clinic/index.html',
    'hospitals/240010-the-johns-hopkins-hospital/index.html',
    'hospitals/220071-massachusetts-general-hospital/index.html',
    'hospitals/240004-mayo-clinic-hospital-rochester/index.html',
    'hospitals/050262-ronald-reagan-ucla-medical-center/index.html',
    'hospitals/140281-northwestern-memorial-hospital/index.html',
    'hospitals/050425-kaiser-foundation-hospital-sacramento/index.html',
    'hospitals/450193-baylor-st-lukes-medical-center/index.html',
    'outcomes-over-time/index.html',
    'interventions/index.html',
    'devices-fda/index.html',
    'devices-fda/FRN/index.html',
    'devices-fda/NIQ/index.html',
    'devices-fda/NVN/index.html',
    'devices-fda/KWP/index.html',
    'devices-fda/NAY/index.html',
    'devices-fda/OQG/index.html',
    'devices-fda/QSN/index.html',
    'devices-fda/MNH/index.html',
    'adverse-events/index.html',
    'methods-data/index.html',
    'eia/index.html',
    'sitemap.xml',
    'robots.txt',
  ];

  test.each(expectedRoutes)('generates valid static file for %s', (relativePath) => {
    const filePath = path.join(outDir, relativePath);
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content.length).toBeGreaterThan(0);

    if (relativePath.endsWith('.html')) {
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html');
      expect(content).toContain('</html>');
    }
  });

  test('sitemap.xml contains valid XML and all expected routes', () => {
    const sitemapContent = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8');
    expect(sitemapContent).toContain('<?xml');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('https://erayaha.github.io/medical-outcomes-explorer');
    expect(sitemapContent).toContain('/hospitals/330214-nyu-langone-hospitals');
    expect(sitemapContent).toContain('/devices-fda/FRN');
    expect(sitemapContent).toContain('/compare');
    expect(sitemapContent).toContain('/clinical-trials');
    expect(sitemapContent).toContain('/research-api');
  });

  test('robots.txt allows search engine crawlers and points to sitemap', () => {
    const robotsContent = fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8');
    expect(robotsContent).toContain('User-Agent: *');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Sitemap:');
  });
});
