import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPicsQueryKey } from '@/api/fetchPics';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchStatsQueryKey } from '@/api/fetchStats';
import { fetchTableDataQueryKey } from '@/api/fetchTableData';

export const refreshData = () => {
  const queryKeys = [
    fetchActivitiesQueryKey(),
    fetchPicsQueryKey(),
    fetchTasksQueryKey(),
    fetchStatsQueryKey(),
    fetchTableDataQueryKey(),
  ];
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};
