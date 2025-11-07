import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPICsQueryKey } from '@/api/fetchPICs';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchSummaryQueryKey } from '@/api/fetchSummary';
import { fetchTableSummaryQueryKey } from '@/api/fetchTableSummary';
import { cn } from '@/lib/utils';
import { formatTimestamp } from '@/utils/formatTimestamp';

export const RefreshToggle = ({ isFetching, dataUpdatedAt }) => {
  const refreshData = () => {
    const queryKeys = [
      fetchActivitiesQueryKey(),
      fetchPICsQueryKey(),
      fetchTasksQueryKey(),
      fetchSummaryQueryKey(),
      fetchTableSummaryQueryKey(),
    ];
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={refreshData}
          disabled={isFetching}
        >
          <RefreshCw className={cn({ 'animate-spin': isFetching })} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Terakhir Diperbarui:{' '}
          {dataUpdatedAt ? formatTimestamp(dataUpdatedAt) : '-'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
