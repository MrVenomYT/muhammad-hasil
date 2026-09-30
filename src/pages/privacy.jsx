import PrivacySection from '../components/PrivacySection';

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default function PrivacyPage() {
  return <PrivacySection />;
}
