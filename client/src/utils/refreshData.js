import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPicsQueryKey } from '@/api/fetchPics';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchSummaryQueryKey } from '@/api/fetchSummary';
import { fetchTableSummaryQueryKey } from '@/api/fetchTableSummary';

export const refreshData = () => {
  const queryKeys = [
    fetchActivitiesQueryKey(),
    fetchPicsQueryKey(),
    fetchTasksQueryKey(),
    fetchSummaryQueryKey(),
    fetchTableSummaryQueryKey(),
  ];
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};
