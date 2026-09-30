import ServicesSection from '../components/ServicesSection';
import { getServices } from '../lib/server-store';
import { generateSEOMetadata } from '../lib/seo';
import SEOHead from '../components/SEOHead';

export async function getServerSideProps() {
  try {
    const services = await getServices();
    const serviceTitles = services.map(s => s.title).join(', ');
    const description = services.length > 0
      ? `Professional software engineering and web development services by Muhammad Hasil: ${serviceTitles}.`
      : 'Professional full-stack development, API integration, and custom Discord/Minecraft development services.';

    const seo = generateSEOMetadata({
      title: 'Full Stack Engineering & Web Development Services',
      description,
      imageUrl: '/assets/muhammad-hasil.png',
      url: 'https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/services',
      category: 'Professional Software Services',
      schemaType: 'ItemList',
      schemaData: {
        itemListElement: services.map((s, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: s.title,
          url: `https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/services/${s.id || s._id}`
        }))
      }
    });

    return {
      props: {
        initialServices: JSON.parse(JSON.stringify(services || [])),
        seo
      }
    };
  } catch (error) {
    console.error('getServerSideProps services error:', error);
    return {
      props: {
        initialServices: [],
        seo: generateSEOMetadata({ title: 'Engineering Services', description: 'Full Stack Web Development & API Integration Services.' })
      }
    };
  }
}

export default function ServicesPage({ initialServices, seo }) {
  return (
    <>
      <SEOHead seo={seo} />
      <ServicesSection initialServices={initialServices} />
    </>
  );
}
