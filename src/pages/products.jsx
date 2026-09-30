import ProductsSection from '../components/ProductsSection';
import { getProducts } from '../lib/server-store';

export async function getServerSideProps() {
  try {
    const products = await getProducts();
    return {
      props: {
        initialProducts: JSON.parse(JSON.stringify(products || []))
      }
    };
  } catch (error) {
    console.error('getServerSideProps products error:', error);
    return {
      props: {
        initialProducts: []
      }
    };
  }
}

export default function ProductsPage({ initialProducts }) {
  return <ProductsSection initialProducts={initialProducts} />;
}
