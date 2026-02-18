import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { format } from 'date-fns';

export const fetchTasks = async ({ queryKey }) => {
  const [_key, { picId, range }] = queryKey;
  const params = {};

  if (picId && picId !== 'all') {
    params.pic_id = picId;
  }

  if (range?.from && range?.to) {
    params.start_date = format(range.from, 'yyyy-MM-dd');
    params.end_date = format(range.to, 'yyyy-MM-dd');
  }

  const response = await api.get('/tasks.php', { params });
  return response.data;
};

export const fetchTasksQueryKey = (filters = {}) => ['tasks', filters];

export const useFetchTasks = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchTasksQueryOptions(filters),
    ...params.queryConfig,
  });
};

const fetchTasksQueryOptions = (filters) => {
  return queryOptions({
    queryKey: fetchTasksQueryKey(filters),
    queryFn: fetchTasks,
  });
};
