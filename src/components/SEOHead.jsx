import React from 'react';
import Head from 'next/head';

export default function SEOHead({ seo }) {
  if (!seo) return null;

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      {seo.ogUrl && <link rel="canonical" href={seo.ogUrl} />}
      
      {/* OpenGraph / Social Sharing Tags */}
      <meta property="og:type" content={seo.ogType || 'website'} />
      <meta property="og:title" content={seo.ogTitle || seo.title} />
      <meta property="og:description" content={seo.ogDescription || seo.description} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      {seo.ogImage && <meta property="og:image:alt" content={seo.ogTitle || seo.title} />}
      {seo.ogUrl && <meta property="og:url" content={seo.ogUrl} />}
      <meta property="og:site_name" content={seo.ogSiteName || 'iHasil'} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={seo.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seo.twitterTitle || seo.title} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.description} />
      {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
      {seo.twitterImage && <meta name="twitter:image:alt" content={seo.twitterTitle || seo.title} />}

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
