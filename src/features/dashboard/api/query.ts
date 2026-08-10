import { supabase } from '@/lib/supabase';
import type { DashboardFilters } from '../hooks/useDashboardFilters';

export const dashboardQuery = (filters: DashboardFilters = {}) =>
  supabase.rpc('get_dashboard_overview', {
    p_from_date: filters?.from_date ?? undefined,
    p_to_date: filters?.to_date ?? undefined,
  });
