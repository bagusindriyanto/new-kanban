import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/authStore';

const GuestRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
