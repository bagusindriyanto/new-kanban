// hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import useAuthStore from '@/stores/authStore';
import type { UpdateProfileInput } from '../schemas/updateUserSchemas';
import type { ProfileUpdate } from '@/types/profile';
import { uploadAvatar } from './uploadAvatar';

export const useUpdateProfile = () => {
  const userId = useAuthStore((state) => state.currentUser?.id);

  return useMutation({
    mutationFn: async (payload: UpdateProfileInput) => {
      if (!userId) throw new Error('User tidak ditemukan');

      // Ambil avatar lama dulu untuk dihapus nanti
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('avatar')
        .eq('user_id', userId)
        .single();

      let avatarUrl: string | undefined;
      const shouldDeleteAvatar =
        payload.delete_avatar && !payload.avatar && !!currentProfile?.avatar;

      // Upload avatar dulu kalau user pilih file baru
      const avatarFile = payload.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(userId, avatarFile);
      }

      const updates: ProfileUpdate = {
        full_name: payload.full_name,
        name: payload.name,
        nik: payload.nik,
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
      if ((avatarUrl || shouldDeleteAvatar) && !!currentProfile?.avatar) {
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
