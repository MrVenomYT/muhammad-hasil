import AboutSection from '../components/AboutSection';
import { getAbout } from '../lib/server-store';

export async function getServerSideProps() {
  try {
    const about = await getAbout();
    return {
      props: {
        initialAbout: JSON.parse(JSON.stringify(about || null))
      }
    };
  } catch (error) {
    console.error('getServerSideProps about error:', error);
    return {
      props: {
        initialAbout: null
      }
    };
  }
}

export default function AboutPage({ initialAbout }) {
  return <AboutSection initialAbout={initialAbout} />;
}
