import { supabase } from '@/lib/supabase';

export const divisionsQuery = () =>
  supabase.from('divisions').select('id, name');
