import type { TaskFilters } from '../hooks/useTaskFilters';

export const taskKeys = {
  all: ['tasks'] as const,
  filters: (filters: TaskFilters) => [...taskKeys.all, filters] as const,
};

export type TaskKeys =
  | typeof taskKeys.all
  | ReturnType<typeof taskKeys.filters>;
