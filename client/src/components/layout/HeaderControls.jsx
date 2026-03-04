import { Link } from 'react-router';
import { ChartNoAxesCombined } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterPICs from '@/components/shared/filter/FilterPICs';
import ModeToggle from '@/components/layout/ModeToggle';
import AddItemsDropdown from '@/components/layout/AddItemsDropdown';
import UpcomingTasksPanel from '../tasks/UpcomingTasksPanel';
import LogoutButton from '../auth/LogoutButton';

const HeaderControls = ({
  tasks = [],
  isFetching,
  dataUpdatedAt,
  currentTime,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <RefreshToggle isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      <FilterPICs />
      <FilterCalendar />
      <UpcomingTasksPanel tasks={tasks} currentTime={currentTime} />
      <AddItemsDropdown />
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" size="icon-sm">
            <Link to="/summary">
              <ChartNoAxesCombined />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ringkasan</p>
        </TooltipContent>
      </Tooltip>
      <ModeToggle />
      <LogoutButton />
    </div>
  );
};

export default HeaderControls;
