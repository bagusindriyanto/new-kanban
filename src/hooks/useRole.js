import useAuthStore from '@/stores/authStore';

export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  return {
    role: user?.role.name,
    picId: user?.pic.id,
    isAdmin: user?.role.name === 'Admin',
    isManager: user?.role.name === 'Manager',
    isAdminOrManager: ['Admin', 'Manager'].includes(user?.role.name),
    isOwner: (taskPicId) => user?.pic.id === taskPicId,
    hasRole: (...roles) => roles.includes(user?.role.name),
  };
};
