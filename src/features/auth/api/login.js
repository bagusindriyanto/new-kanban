import { api } from '@/lib/axios';

export const me = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};
