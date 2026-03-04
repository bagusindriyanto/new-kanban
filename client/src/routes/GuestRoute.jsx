import { Navigate, Outlet } from 'react-router';
import useAuth from '@/stores/authStore';
import LoadingPage from '@/pages/LoadingPage';

const GuestRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
