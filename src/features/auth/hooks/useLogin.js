import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/login';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
};
