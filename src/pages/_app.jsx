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

  return (
    <AuthProvider>
      <Head>
        <title>Muhammad Hasil - Full Stack Developer & UI/UX Designer</title>
        <meta name="description" content="Muhammad Hasil is a Full Stack Developer & UI/UX Designer specializing in React, Next.js, Node.js, custom APIs, Discord bots, and gaming platforms." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
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
    </AuthProvider>
  );
}
