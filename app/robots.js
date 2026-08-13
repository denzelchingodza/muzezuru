import { SITE_URL } from "./site-config";

// Explicitly permissive -- including for AI crawlers (GPTBot, ClaudeBot,
// Google-Extended, CCBot) rather than leaving them blocked by default.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
