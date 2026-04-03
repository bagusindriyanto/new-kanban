import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import LoadingPage from '@/pages/LoadingPage';

const GuestRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <LoadingPage />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
