import "./globals.css";
import { SITE_URL } from "./site-config";

const description =
  "Muzezuru is a Shona-language AI chat companion, fine-tuned on BLOOMZ-3B via QLoRA. Chat with it in Shona, free and open source.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muzezuru -- Shona-speaking AI",
    template: "%s -- Muzezuru",
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Muzezuru -- Shona-speaking AI",
    description,
    url: SITE_URL,
    siteName: "Muzezuru",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muzezuru -- Shona-speaking AI",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Muzezuru",
  description,
  url: SITE_URL,
  applicationCategory: "Chat",
  operatingSystem: "Any (web browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["sn", "en"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
