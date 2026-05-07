import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPicsQueryKey } from '@/api/fetchPics';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchStatsQueryKey } from '@/api/fetchStats';
import { fetchTableDataQueryKey } from '@/api/fetchTableData';
import { fetchChartDataQueryKey } from '@/api/fetchChartData';
import { fetchUpcomingTasksQueryKey } from '@/api/fetchUpcomingTasks';

export const refreshData = () => {
  const queryKeys = [
    fetchActivitiesQueryKey(),
    fetchPicsQueryKey(),
    fetchTasksQueryKey(),
    fetchStatsQueryKey(),
    fetchTableDataQueryKey(),
    fetchChartDataQueryKey(),
    fetchUpcomingTasksQueryKey(),
  ];
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};
