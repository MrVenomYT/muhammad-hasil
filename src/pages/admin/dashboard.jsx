import AdminDashboardSection from '../../components/AdminDashboardSection';
import ProtectedRoute from '../../components/ProtectedRoute';

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardSection />
    </ProtectedRoute>
  );
}
