import { BASE_URL } from '@/lib/api';

export const getAvatarURL = (avatarPath) => {
  return avatarPath ? `${BASE_URL}/${avatarPath}` : null;
};
