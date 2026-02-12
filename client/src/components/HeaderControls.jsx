import { Link } from 'react-router';
import { ChartNoAxesCombined } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshToggle } from '@/components/RefreshToggle';
import { FilterCalendar } from '@/components/FilterCalendar';
import ModeToggle from '@/components/ModeToggle';
import AddItemsDropdown from '@/components/AddItemsDropdown';
import UpcomingTasksPanel from './UpcomingTasksPanel';

const HeaderControls = ({
  pics = [],
  tasks = [],
  selectedPicId,
  setSelectedPicId,
  isFetching,
  dataUpdatedAt,
  currentTime,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <RefreshToggle isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      <Select value={selectedPicId} onValueChange={setSelectedPicId}>
        <SelectTrigger className="w-[150px] bg-white" size="sm">
          <SelectValue placeholder="Pilih PIC" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>PIC</SelectLabel>
            <SelectItem value="all">Semua PIC</SelectItem>
            {pics?.map((pic) => (
              <SelectItem value={pic.id} key={pic.id}>
                {pic.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
    </div>
  );
};

export default HeaderControls;
