import AboutSection from '../components/AboutSection';
import SEOHead from '../components/SEOHead';
import { getAbout } from '../lib/server-store';
import { generateSEOMetadata } from '../lib/seo';

export async function getServerSideProps() {
  try {
    const about = await getAbout();
    const seo = generateSEOMetadata({
      title: 'About Muhammad Hasil – Experience & Credentials',
      description: 'Learn more about Muhammad Hasil: 6+ years building full-stack applications, academic background, certifications, and engineering philosophy.',
      url: 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/about'
    });

    return {
      props: {
        initialAbout: JSON.parse(JSON.stringify(about || null)),
        seo
      }
    };
  } catch (error) {
    console.error('getServerSideProps about error:', error);
    return {
      props: {
        initialAbout: null,
        seo: generateSEOMetadata({ title: 'About Muhammad Hasil' })
      }
    };
  }
}

export default function AboutPage({ initialAbout, seo }) {
  return (
    <>
      <SEOHead seo={seo} />
      <AboutSection initialAbout={initialAbout} />
    </>
  );
}
