import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ClockIcon } from 'lucide-react';
import WorktimeInput from './WorktimeInput';
import { useIsMobile } from '@/hooks/useMobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const WorktimeMenu = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer showSwipeHandle>
        <Tooltip>
          <TooltipTrigger
            render={
              <DrawerTrigger
                render={<Button variant="secondary" size="icon-sm" />}
              />
            }
          >
            <ClockIcon />
          </TooltipTrigger>
          <TooltipContent>Jam Kerja</TooltipContent>
        </Tooltip>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Jam Kerja</DrawerTitle>
            <DrawerDescription>Masukkan jam kerja hari ini.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <WorktimeInput />
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              Tutup
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={<Button variant="secondary" size="icon-sm" />}
            />
          }
        >
          <ClockIcon />
        </TooltipTrigger>
        <TooltipContent>Jam Kerja</TooltipContent>
      </Tooltip>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Jam Kerja</PopoverTitle>
          <PopoverDescription>Masukkan jam kerja hari ini.</PopoverDescription>
        </PopoverHeader>
        <WorktimeInput />
      </PopoverContent>
    </Popover>
  );
};

export default WorktimeMenu;
