import { supabase } from '@/lib/supabase';

export const rolesQuery = () => supabase.from('roles').select('id, name');
