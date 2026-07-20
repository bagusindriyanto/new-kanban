import { supabase } from '@/lib/supabase';

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
