// Single source of truth for the deployed URL, used by metadata, the
// canonical tag, robots.js, and sitemap.js. Set NEXT_PUBLIC_SITE_URL in
// your Vercel project's environment variables once you know your real
// domain (e.g. https://muzezuru.vercel.app) -- until then this fallback
// is used.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://muzezuru.vercel.app";
