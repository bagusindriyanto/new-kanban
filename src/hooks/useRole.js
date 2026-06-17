import useAuthStore from '@/stores/authStore';

export const useRole = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  return {
    role: currentUser?.role.name,
    userId: currentUser?.id,
    isAdmin: currentUser?.role.name === 'Admin',
    isManager: currentUser?.role.name === 'Manager',
    isAdminOrManager: ['Admin', 'Manager'].includes(currentUser?.role.name),
    isOwner: (userId) => currentUser?.id === userId,
    hasRole: (...roles) => roles.includes(currentUser?.role.name),
  };
};
