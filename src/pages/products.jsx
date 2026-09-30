import ProductsSection from '../components/ProductsSection';
import SEOHead from '../components/SEOHead';
import { getProducts } from '../lib/server-store';
import { generateSEOMetadata } from '../lib/seo';

export async function getServerSideProps() {
  try {
    const products = await getProducts();
    const productTitles = products.map(p => p.title).join(', ');
    const description = products.length > 0
      ? `Browse premium digital products, UI templates, and web apps created by Muhammad Hasil: ${productTitles}.`
      : 'Browse premium digital products, source codes, and developer templates by Muhammad Hasil.';

    const seo = generateSEOMetadata({
      title: 'Digital Store | Web Apps, Templates & UI Systems',
      description,
      imageUrl: products[0]?.imageUrl || '/assets/thumbnail.png',
      url: 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/products',
      category: 'Digital Products',
      schemaType: 'ItemList',
      schemaData: {
        itemListElement: products.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.title,
          url: `https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/products`
        }))
      }
    });

    return {
      props: {
        initialProducts: JSON.parse(JSON.stringify(products || [])),
        seo
      }
    };
  } catch (error) {
    console.error('getServerSideProps products error:', error);
    return {
      props: {
        initialProducts: [],
        seo: generateSEOMetadata({ title: 'Digital Store & Products' })
      }
    };
  }
}

export default function ProductsPage({ initialProducts, seo }) {
  return (
    <>
      <SEOHead seo={seo} />
      <ProductsSection initialProducts={initialProducts} />
    </>
  );
}
