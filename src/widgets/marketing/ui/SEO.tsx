import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  jsonLd?: any;
}

const SEO: React.FC<SEOProps> = ({
  title = "RPMS.pl - Hybrydowa Windykacja B2B | Kancelaria Prawna",
  description = "Odzyskaj swoje pieniądze z RPMS. Połączenie twardej wiedzy prawniczej Kancelarii RPMS z nowoczesnymi rozwiązaniami. Skuteczna windykacja B2B bez opłat wstępnych.",
  keywords = "windykacja, windykacja b2b, kancelaria prawna, odzyskiwanie długów, epu, pozew online, rpms",
  image = "https://rpms.pl/og-image.jpg", // Przykładowy obraz OG
  url = "https://rpms.pl",
  type = "website",
  jsonLd
}) => {
  const siteTitle = title.includes("RPMS") ? title : `${title} | RPMS.pl`;

  return (
    <Head>
      {/* Podstawowe Meta Tagi */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
};

export default SEO;
