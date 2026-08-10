import { supabase } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';
import { uploadAvatar } from './uploadAvatar';
import type { RegisterInput } from '../schemas/authSchemas';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (values: RegisterInput) => {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.full_name,
              name: values.name,
              nik: values.nik,
              role_id: values.role_id,
              division_id: values.division_id,
            },
          },
        },
      );

      if (signUpError) throw signUpError;
      if (!authData.user)
        throw new Error('Registrasi gagal, silakan coba lagi');

      const userId = authData.user.id;

      // 2. Upload avatar kalau ada file dipilih
      const avatarFile = values.avatar;

      if (avatarFile) {
        const avatarUrl = await uploadAvatar(userId, avatarFile);

        // 3. Update kolom avatar di profiles (row sudah ada dari trigger)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar: avatarUrl })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      }

      return authData;
    },
  });
};
