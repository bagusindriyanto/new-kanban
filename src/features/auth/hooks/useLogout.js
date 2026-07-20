import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../api/logout';

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
    onError: (error) => {
      console.error('Logout failed:', error.message);
    },
  });
};
