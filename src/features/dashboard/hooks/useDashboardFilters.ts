import { useFilterStore } from '@/stores/filterStore';
import { format } from 'date-fns';

export type DashboardFilters = {
  from_date?: string;
  to_date?: string;
};

export const useDashboardFilters = () => {
  const range = useFilterStore((state) => state.range);

  const dashboardFilters: DashboardFilters = {
    from_date: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
    to_date: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
  };

  return {
    range,
    dashboardFilters,
  };
};
