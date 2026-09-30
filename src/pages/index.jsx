import HomeSection from '../components/HomeSection';
import { getProjects, getAbout, getProducts, getReviews } from '../lib/server-store';

export async function getServerSideProps() {
  try {
    const projects = await getProjects();
    const about = await getAbout();
    const products = await getProducts();
    const reviews = await getReviews();

    return {
      props: {
        initialProjects: JSON.parse(JSON.stringify(projects || [])),
        initialAbout: JSON.parse(JSON.stringify(about || null)),
        initialProducts: JSON.parse(JSON.stringify(products || [])),
        initialReviews: JSON.parse(JSON.stringify(reviews || []))
      }
    };
  } catch (error) {
    console.error('getServerSideProps index error:', error);
    return {
      props: {
        initialProjects: [],
        initialAbout: null,
        initialProducts: [],
        initialReviews: []
      }
    };
  }
}

export default function HomePage(props) {
  return <HomeSection {...props} />;
}
