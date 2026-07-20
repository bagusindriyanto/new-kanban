import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import FullPageLoader from '@/components/shared/FullPageLoader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { session, isInitialized } = useAuthStore();

  if (!isInitialized) return <FullPageLoader />;
  if (!session) return <Navigate to="/login" replace />;
  // if (allowedRoles && !allowedRoles.includes(currentUser.role.name)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
