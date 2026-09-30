import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import CanvasAnimation from '../components/CanvasAnimation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetcher } from '../lib/usePortfolioData';

import '../../style.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const globalDefaultTitle = "iHasil – Muhammad Hasil | Full Stack Developer & UI/UX Designer";
  const globalDefaultDesc = "Explore production full-stack web applications, React & Next.js systems, digital store products, and engineering services by Muhammad Hasil (iHasil).";
  const globalDefaultImage = "https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/assets/muhammad-hasil.png";
  const globalCurrentUrl = `https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app${router.asPath === '/' ? '' : router.asPath.split('?')[0]}`;

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateIfStale: true,
        revalidateOnMount: true,
        dedupingInterval: 4000
      }}>
        <AuthProvider>
          <Head>
            {/* Primary Meta Tags */}
            <title>{globalDefaultTitle}</title>
            <meta name="title" content={globalDefaultTitle} />
            <meta name="description" content={globalDefaultDesc} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="keywords" content="Muhammad Hasil, iHasil, Full Stack Developer, React, Next.js, UI/UX Designer, Node.js, MongoDB, Web Portfolio" />
            <meta name="author" content="Muhammad Hasil" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={globalCurrentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={globalCurrentUrl} />
            <meta property="og:title" content={globalDefaultTitle} />
            <meta property="og:description" content={globalDefaultDesc} />
            <meta property="og:image" content={globalDefaultImage} />
            <meta property="og:image:alt" content="Muhammad Hasil (iHasil) - Full Stack Developer & UI/UX Designer" />
            <meta property="og:site_name" content="iHasil – Muhammad Hasil" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={globalCurrentUrl} />
            <meta name="twitter:title" content={globalDefaultTitle} />
            <meta name="twitter:description" content={globalDefaultDesc} />
            <meta name="twitter:image" content={globalDefaultImage} />
            <meta name="twitter:image:alt" content="Muhammad Hasil (iHasil) - Full Stack Developer & UI/UX Designer" />

            {/* Schema.org Person and WebSite JSON-LD */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  "name": "Muhammad Hasil",
                  "alternateName": "iHasil",
                  "url": "https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app",
                  "image": globalDefaultImage,
                  "jobTitle": "Full Stack Developer & UI/UX Designer",
                  "worksFor": {
                    "@type": "Organization",
                    "name": "iHasil Studio"
                  },
                  "sameAs": [
                    "https://www.linkedin.com/in/muhammad-hasil/",
                    "https://pro.fiverr.com/users/venomdesigne613/",
                    "https://www.patreon.com/MrVenomYT"
                  ]
                })
              }}
            />
          </Head>
          <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
            <CanvasAnimation currentPath={router.pathname} />
            {isAdmin ? (
              <main id="admin-wrapper" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', backgroundColor: 'transparent' }}>
                <Component {...pageProps} />
              </main>
            ) : (
              <div className="portfolio-container" style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <main id="pages-wrapper">
                  <Component {...pageProps} />
                </main>
                <Footer />
              </div>
            )}
          </div>
        </AuthProvider>
      </SWRConfig>
    </QueryClientProvider>
  );
}
