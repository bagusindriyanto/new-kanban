import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
