import useAuthStore from '@/stores/authStore';

export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  return {
    role: user?.role,
    picId: user?.id,
    isAdmin: user?.role === 'Admin',
    isManager: user?.role === 'Manager',
    isAdminOrManager: ['Admin', 'Manager'].includes(user?.role),
    isOwner: (taskPicId) => user?.id === taskPicId,
    hasRole: (...roles) => roles.includes(user?.role),
  };
};
