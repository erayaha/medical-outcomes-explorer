import { productionUrl } from "@/lib/site-config";
import { getDevices, getHospitals } from "@/lib/site-data";

export const dynamic = "force-static";

export default function sitemap() {
  const base = process.env.SITE_URL || productionUrl;
  const staticRoutes = [
    "",
    "/hospitals",
    "/outcomes-over-time",
    "/interventions",
    "/devices-fda",
    "/adverse-events",
    "/methods-data",
    "/eia",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date("2026-05-19") })),
    ...getHospitals().map((hospital) => ({ url: `${base}/hospitals/${hospital.slug}`, lastModified: new Date("2026-05-19") })),
    ...getDevices().map((device) => ({ url: `${base}/devices-fda/${device.productCode}`, lastModified: new Date("2026-05-19") })),
  ];
}
