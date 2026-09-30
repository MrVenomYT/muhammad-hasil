import React from 'react';
import Head from 'next/head';

export default function SEOHead({ seo }) {
  if (!seo) return null;

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      
      {/* OpenGraph Tags */}
      <meta property="og:type" content={seo.ogType || 'website'} />
      <meta property="og:title" content={seo.ogTitle || seo.title} />
      <meta property="og:description" content={seo.ogDescription || seo.description} />
      <meta property="og:image" content={seo.ogImage} />
      {seo.ogUrl && <meta property="og:url" content={seo.ogUrl} />}
      <meta property="og:site_name" content="Muhammad Hasil Portfolio" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={seo.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seo.twitterTitle || seo.title} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.description} />
      <meta name="twitter:image" content={seo.twitterImage || seo.ogImage} />

      {/* Schema.org JSON-LD Structured Data */}
      {seo.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }}
        />
      )}
    </Head>
  );
}
