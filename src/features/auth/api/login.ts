import { supabase } from '@/lib/supabase';
import type { LoginInput } from '../schemas/authSchemas';
import { useMutation } from '@tanstack/react-query';

export const loginUser = async ({ email, password }: LoginInput) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
