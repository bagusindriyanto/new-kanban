import { supabase } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
    onError: (error) => {
      console.error('Log out gagal:', error.message);
    },
  });
};
