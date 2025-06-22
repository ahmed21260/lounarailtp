import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './context/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { seoConfig } from './seo-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: `%s | ${seoConfig.site.name}`,
    default: seoConfig.pages.home.title,
  },
  description: seoConfig.site.description,
  keywords: seoConfig.site.keywords,
  authors: [{ name: seoConfig.site.author, url: seoConfig.site.url }],
  creator: seoConfig.site.author,
  publisher: seoConfig.site.publisher,
  openGraph: seoConfig.openGraph,
  twitter: seoConfig.twitter,
  robots: seoConfig.robots,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoConfig.structuredData.organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoConfig.structuredData.localBusiness) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
        <Analytics />
        <script src="/assets/js/visitor-tracker.js" defer></script>
      </body>
    </html>
  );
} 