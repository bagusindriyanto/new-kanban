// hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';

export const useUpdatePassword = () => {
  const email = useAuthStore((state) => state.currentUser?.email);

  return useMutation({
    mutationFn: async (values) => {
      if (!email) throw new Error('Email user tidak ditemukan');

      // Re-authenticate dengan password lama
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: values.old_password,
      });

      if (loginError) {
        throw new Error('Password lama salah');
      }

      // 2. Baru update ke password baru
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.new_password,
      });

      if (updateError) throw updateError;
    },
  });
};
