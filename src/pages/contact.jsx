import ContactSection from '../components/ContactSection';
import SEOHead from '../components/SEOHead';
import { generateSEOMetadata } from '../lib/seo';

export async function getServerSideProps() {
  const seo = generateSEOMetadata({
    title: 'Contact & Hire Muhammad Hasil',
    description: 'Get in touch with Muhammad Hasil for freelance full-stack web development, custom Next.js applications, and UI/UX design collaboration.',
    url: 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/contact'
  });

  return {
    props: {
      seo
    }
  };
}

export default function ContactPage({ seo }) {
  return (
    <>
      <SEOHead seo={seo} />
      <ContactSection />
    </>
  );
}
