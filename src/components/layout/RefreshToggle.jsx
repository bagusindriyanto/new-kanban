import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { refreshData } from '@/utils/refreshData';
import { format } from 'date-fns';
import { useIsFetching } from '@tanstack/react-query';

export const RefreshToggle = ({ dataUpdatedAt }) => {
  const isFetching = useIsFetching();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={refreshData}
            disabled={isFetching}
          />
        }
      >
        <RefreshCw className={cn({ 'animate-spin': isFetching })} />
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Terakhir Diperbarui:{' '}
          {dataUpdatedAt ? format(dataUpdatedAt, 'd/M/yyyy, HH:mm:ss') : '-'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
