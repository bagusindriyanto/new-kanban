import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from '@/api/fetchActivities';
import { fetchPicsQueryKey } from '@/api/fetchPics';
import { fetchTasksQueryKey } from '@/api/fetchTasks';
import { fetchSummaryQueryKey } from '@/api/fetchSummary';
import { fetchTableSummaryQueryKey } from '@/api/fetchTableSummary';
import { cn } from '@/lib/utils';

export const RefreshButton = ({ isFetching }) => {
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: fetchActivitiesQueryKey() });
    queryClient.invalidateQueries({ queryKey: fetchPicsQueryKey() });
    queryClient.invalidateQueries({ queryKey: fetchTasksQueryKey() });
    queryClient.invalidateQueries({ queryKey: fetchSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: fetchTableSummaryQueryKey() });
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
        <p>Refresh Data</p>
      </TooltipContent>
    </Tooltip>
  );
};
