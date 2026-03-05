import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPICsQueryKey } from '@/api/fetchPICs';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchSummaryQueryKey } from '@/api/fetchSummary';

export const refreshData = () => {
  const queryKeys = [
    fetchActivitiesQueryKey(),
    fetchPICsQueryKey(),
    fetchTasksQueryKey(),
    fetchSummaryQueryKey(),
  ];
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};
