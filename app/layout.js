import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { productionUrl, siteDescription, siteName } from "@/lib/site-config";

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || productionUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
