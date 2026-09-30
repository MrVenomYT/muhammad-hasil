import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import CanvasAnimation from '../components/CanvasAnimation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetcher } from '../lib/usePortfolioData';

import '../../style.css';

export default function App({ Component, pageProps, router }) {
  const pathname = router?.pathname || '/';
  const isAdmin = typeof pathname === 'string' && pathname.startsWith('/admin');

  // React Query client instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

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
          <ToastProvider>
            <Head>
              <title>iHasil</title>
              <meta name="description" content="Professional portfolio and SaaS showcase for iHasil featuring projects, products, services, admin dashboard, and contact capabilities." />
              <meta property="og:title" content="iHasil" />
              <meta property="og:description" content="Professional portfolio and SaaS showcase for iHasil featuring projects, products, services, admin dashboard, and contact capabilities." />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
              <CanvasAnimation currentPath={pathname} />
              {isAdmin ? (
                <main id="admin-wrapper" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', backgroundColor: 'transparent' }}>
                  <Component {...pageProps} />
                </main>
              ) : (
                <div className="portfolio-container" style={{ position: 'relative', zIndex: 1 }}>
                  <Navbar currentPath={pathname} />
                  <main id="pages-wrapper">
                    <Component {...pageProps} />
                  </main>
                  <Footer />
                </div>
              )}
            </div>
          </ToastProvider>
        </AuthProvider>
      </SWRConfig>
    </QueryClientProvider>
  );
}
