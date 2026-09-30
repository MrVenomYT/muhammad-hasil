import AdminLoginSection from '../../components/AdminLoginSection';

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default function AdminLoginPage() {
  return <AdminLoginSection />;
}
