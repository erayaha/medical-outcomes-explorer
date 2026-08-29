import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";

export const metadata = {
  title: "Contact & Community Support | Medical Outcomes Explorer",
  description:
    "Get in touch with the Medical Outcomes Explorer engineering team for research collaborations, dataset feedback, and technical support.",
};

export default function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Medical Outcomes Explorer Team",
    url: "https://erayaha.github.io/medical-outcomes-explorer/contact/",
    mainEntity: {
      "@type": "Organization",
      "name": "Erayaha",
      "url": "https://github.com/erayaha",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "email": "contact@erayaha.org",
        "availableLanguage": ["English"],
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
      },
    },
  };

  return (
    <SiteShell currentPath="/contact">
      <StructuredData data={structuredData} />
      <div className="page-header">
        <span className="badge badge-accent">Community & Support</span>
        <h1 className="hero-title">Contact & Technical Support</h1>
        <p className="hero-subtitle">
          Connect with our healthcare data engineering team, report data discrepancies, or propose new clinical quality indicators.
        </p>
      </div>

      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>Get in Touch</h2>
          <p>
            We actively collaborate with healthcare researchers, clinical quality analysts, medtech regulatory consultants, and open data developers.
          </p>
        </div>

        <div className="grid-two">
          <div>
            <h3>Direct Contact Channels</h3>
            <ul>
              <li><strong>General Inquiries:</strong> <a href="mailto:contact@erayaha.org">contact@erayaha.org</a></li>
              <li><strong>Data Discrepancies & QA:</strong> <a href="mailto:data@erayaha.org">data@erayaha.org</a></li>
              <li><strong>GitHub Issues:</strong> <a href="https://github.com/erayaha/medical-outcomes-explorer/issues">github.com/erayaha/medical-outcomes-explorer/issues</a></li>
              <li><strong>Organization:</strong> <a href="https://github.com/erayaha">github.com/erayaha</a></li>
            </ul>
          </div>

          <div>
            <h3>Office & Support Hours</h3>
            <p>
              Erayaha Open Source Intelligence<br />
              San Francisco, CA, United States<br /><br />
              <strong>Support Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM PST<br />
              <strong>Standard Response Time:</strong> Within 24–48 business hours.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
