import type { DashboardFilters } from '../hooks/useDashboardFilters';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  filters: (filters: DashboardFilters = {}) =>
    [...dashboardKeys.all, filters] as const,
};
