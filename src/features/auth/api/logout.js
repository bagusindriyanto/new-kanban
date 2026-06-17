import { api, getRefreshToken } from '@/lib/axios';

export const logout = async () => {
  const response = await api.post('/auth/logout', {
    refresh_token: getRefreshToken(),
  });
  return response.data;
};
