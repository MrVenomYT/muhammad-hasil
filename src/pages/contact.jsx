import ContactSection from '../components/ContactSection';

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default function ContactPage() {
  return <ContactSection />;
}
