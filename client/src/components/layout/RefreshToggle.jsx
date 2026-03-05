import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { refreshData } from '@/utils/refreshData';

export const RefreshToggle = ({ isFetching, dataUpdatedAt }) => {
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
