import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import FullPageLoader from '@/components/shared/FullPageLoader';

const GuestRoute = () => {
  const { session, isInitialized } = useAuthStore();

  if (!isInitialized) return <FullPageLoader />;
  if (session) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
