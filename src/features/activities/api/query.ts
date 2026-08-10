import { supabase } from '@/lib/supabase';
import type { QueryData } from '@supabase/supabase-js';

export const activitiesQuery = () =>
  supabase
    .from('activities')
    .select('id, name')
    .order('updated_at', { ascending: false });

export type Activity = QueryData<ReturnType<typeof activitiesQuery>>[number];
