import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import FullPageLoader from '@/components/shared/FullPageLoader';

const GuestRoute = () => {
  const { currentUser, isLoading } = useAuthStore();

  if (isLoading) return <FullPageLoader />;
  if (currentUser) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
