import { useRole } from '@/hooks/useRole';

const RoleGuard = ({ roles, children, fallback = null }) => {
  const { hasRole } = useRole();
  return hasRole(...roles) ? children : fallback;
};

export default RoleGuard;
