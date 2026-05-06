import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPicsQueryKey } from '@/api/fetchPics';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchStatsQueryKey } from '@/api/fetchStats';
import { fetchTableSummaryQueryKey } from '@/api/fetchTableSummary';

export const refreshData = () => {
  const queryKeys = [
    fetchActivitiesQueryKey(),
    fetchPicsQueryKey(),
    fetchTasksQueryKey(),
    fetchStatsQueryKey(),
    fetchTableSummaryQueryKey(),
  ];
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};
