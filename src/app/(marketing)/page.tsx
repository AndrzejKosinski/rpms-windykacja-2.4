import React from 'react';
import { Metadata } from 'next';
import { fetchContentFromCMS } from '../../services/cmsRepository';
import HomeClient from './HomeClient';

export const revalidate = 60; // Rewalidacja co 60 sekund (ISR)

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchContentFromCMS();
  
  const title = siteContent?.seo?.home?.title || "RPMS Windykacja";
  const description = siteContent?.seo?.home?.description || "Szybkie i skuteczne odzyskiwanie należności. Połącz szybkość działania z pewnością prawną.";
  const keywords = siteContent?.seo?.home?.keywords || "windykacja, odzyskiwanie długów, prawnik";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pl_PL',
      siteName: 'RPMS Windykacja',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Home() {
  const siteContent = await fetchContentFromCMS();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RPMS Windykacja",
    "url": "https://rpms-windykacja.pl",
    "logo": "https://rpms-windykacja.pl/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+48-000-000-000",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialContent={siteContent} />
    </>
  );
}
