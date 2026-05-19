import { productionUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots() {
  const base = process.env.SITE_URL || productionUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
