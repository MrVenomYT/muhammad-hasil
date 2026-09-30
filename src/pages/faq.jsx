import FaqSection from '../components/FaqSection';

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default function FaqPage() {
  return <FaqSection />;
}
