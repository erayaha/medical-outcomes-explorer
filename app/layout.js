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
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: productionUrl,
    siteName: siteName,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${productionUrl}/#software`,
        "name": siteName,
        "description": siteDescription,
        "url": productionUrl,
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "publisher": {
          "@id": `${productionUrl}/#organization`
        }
      },
      {
        "@type": "Organization",
        "@id": `${productionUrl}/#organization`,
        "name": "Erayaha",
        "url": "https://github.com/erayaha",
        "logo": `${productionUrl}/logo.png`,
        "sameAs": [
          "https://github.com/erayaha",
          "https://github.com/erayaha/medical-outcomes-explorer"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "contact@erayaha.org",
          "availableLanguage": ["English"]
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US",
          "addressLocality": "San Francisco",
          "addressRegion": "CA"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
