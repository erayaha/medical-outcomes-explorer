import fs from 'node:fs';
import path from 'node:path';

describe('Static Export E2E Integrity', () => {
  const outDir = path.join(process.cwd(), 'out');

  beforeAll(() => {
    // Check if ./out directory exists (run after yarn build)
    if (!fs.existsSync(outDir)) {
      // Build static export if not already built
      const { execSync } = require('node:child_process');
      execSync('yarn build', {
        env: {
          ...process.env,
          PAGES_BASE_PATH: '/medical-outcomes-explorer',
          SITE_URL: 'https://erayaha.github.io/medical-outcomes-explorer',
        },
        stdio: 'pipe',
      });
    }
  });

  const expectedRoutes = [
    'index.html',
    'hospitals/index.html',
    'hospitals/050425-kaiser-foundation-hospital-sacramento/index.html',
    'hospitals/330214-nyu-langone-hospitals/index.html',
    'hospitals/450193-baylor-st-lukes-medical-center/index.html',
    'outcomes-over-time/index.html',
    'interventions/index.html',
    'devices-fda/index.html',
    'devices-fda/FRN/index.html',
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
  });

  test('robots.txt allows search engine crawlers and points to sitemap', () => {
    const robotsContent = fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8');
    expect(robotsContent).toContain('User-Agent: *');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Sitemap:');
  });
});
