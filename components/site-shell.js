import Link from "next/link";
import { navigation, siteName } from "@/lib/site-config";

export function SiteShell({ children }) {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            {siteName}
          </Link>
          <nav className="main-nav" aria-label="Primary">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h2>{siteName}</h2>
            <p>
              Static CMS and FDA analytics for researchers, journalists, and health-tech founders.
            </p>
          </div>
          <div>
            <h2>Disclaimers</h2>
            <p>
              This site summarizes public, facility-level and product-level data only. It does not provide medical advice.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
