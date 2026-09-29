import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';
import CanvasAnimation from '../components/CanvasAnimation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../../style.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <Head>
        <title>Muhammad Hasil Portfolio</title>
        <meta name="description" content="Professional portfolio and SaaS showcase for Muhammad Hasil featuring projects, products, services, admin dashboard, and contact capabilities." />
        <meta property="og:title" content="Muhammad Hasil Portfolio" />
        <meta property="og:description" content="Professional portfolio and SaaS showcase for Muhammad Hasil featuring projects, products, services, admin dashboard, and contact capabilities." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {isAdmin ? (
        <main id="admin-wrapper" style={{ minHeight: '100vh', backgroundColor: '#070605' }}>
          <Component {...pageProps} />
        </main>
      ) : (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <CanvasAnimation currentPath={router.pathname} />
          <div className="portfolio-container">
            <Navbar />
            <main id="pages-wrapper">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
