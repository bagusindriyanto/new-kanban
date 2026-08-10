// hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';
import type { UpdatePasswordInput } from '../schemas/updateUserSchemas';

export const useUpdatePassword = () => {
  const email = useAuthStore((state) => state.currentUser?.email);

  return useMutation({
    mutationFn: async (payload: UpdatePasswordInput) => {
      if (!email) throw new Error('Email user tidak ditemukan');

      // Re-authenticate dengan password lama
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: payload.old_password,
      });

      if (loginError) {
        throw new Error('Password lama salah');
      }

      // Update ke password baru
      const { error: updateError } = await supabase.auth.updateUser({
        password: payload.new_password,
      });

      if (updateError) throw updateError;
    },
  });
};
