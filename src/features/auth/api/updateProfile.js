// hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import useAuthStore from '@/stores/authStore';

const uploadAvatar = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  // pakai timestamp supaya avatar lama otomatis "kalah" di cache browser
  const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
};

export const useUpdateProfile = () => {
  const userId = useAuthStore((state) => state.currentUser?.id);

  return useMutation({
    mutationFn: async (values) => {
      if (!userId) throw new Error('User tidak ditemukan');

      // Ambil avatar lama dulu untuk dihapus nanti
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('avatar')
        .eq('user_id', userId)
        .single();

      let avatarUrl;
      const shouldDeleteAvatar =
        values.delete_avatar && !values.avatar && currentProfile?.avatar;

      // Upload avatar dulu kalau user pilih file baru
      const avatarFile = values.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(userId, avatarFile);
      }

      const updates = {
        full_name: values.full_name,
        name: values.name || null,
        nik: values.nik,
      };
      if (avatarUrl) {
        updates.avatar = avatarUrl;
      } else if (shouldDeleteAvatar) {
        updates.avatar = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      // Cleanup avatar lama setelah update berhasil
      if ((avatarUrl || shouldDeleteAvatar) && currentProfile?.avatar) {
        const oldPath = currentProfile.avatar.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
