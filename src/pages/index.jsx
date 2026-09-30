import HomeSection from '../components/HomeSection';
import SEOHead from '../components/SEOHead';
import { getProjects, getAbout, getProducts, getReviews } from '../lib/server-store';
import { generateSEOMetadata } from '../lib/seo';

export async function getServerSideProps() {
  try {
    const projects = await getProjects();
    const about = await getAbout();
    const products = await getProducts();
    const reviews = await getReviews();

    const seo = generateSEOMetadata({
      title: 'Muhammad Hasil | Full Stack Developer & UI/UX Designer',
      description: 'Professional portfolio of Muhammad Hasil (iHasil) featuring 299+ completed web projects, React/Next.js platforms, digital product store, and engineering services.',
      imageUrl: '/assets/muhammad-hasil.png',
      url: 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/'
    });

    return {
      props: {
        initialProjects: JSON.parse(JSON.stringify(projects || [])),
        initialAbout: JSON.parse(JSON.stringify(about || null)),
        initialProducts: JSON.parse(JSON.stringify(products || [])),
        initialReviews: JSON.parse(JSON.stringify(reviews || [])),
        seo
      }
    };
  } catch (error) {
    console.error('getServerSideProps index error:', error);
    return {
      props: {
        initialProjects: [],
        initialAbout: null,
        initialProducts: [],
        initialReviews: [],
        seo: generateSEOMetadata({ title: 'Full Stack Developer & UI/UX Designer' })
      }
    };
  }
}

export default function HomePage(props) {
  return (
    <>
      <SEOHead seo={props.seo} />
      <HomeSection {...props} />
    </>
  );
}
