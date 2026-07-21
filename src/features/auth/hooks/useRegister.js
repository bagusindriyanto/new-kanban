// hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (values) => {
      // 1. Signup — trigger di DB otomatis buat row di 'profiles'
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
        try {
          const avatarUrl = await uploadAvatar(userId, avatarFile);

          // 3. Update kolom avatar di profiles (row sudah ada dari trigger)
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar: avatarUrl })
            .eq('user_id', userId);

          if (updateError) console.error('Update avatar gagal:', updateError);
        } catch (uploadErr) {
          console.error('Upload avatar gagal:', uploadErr);
        }
      }

      return authData;
    },
  });
}
