import useAuthStore from '@/stores/authStore';

export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  return {
    role: user?.role.name,
    userId: user?.id,
    isAdmin: user?.role.name === 'Admin',
    isManager: user?.role.name === 'Manager',
    isAdminOrManager: ['Admin', 'Manager'].includes(user?.role.name),
    isOwner: (taskUserId) => user?.id === taskUserId,
    hasRole: (...roles) => roles.includes(user?.role.name),
  };
};
