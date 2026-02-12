import { useEffect, useState } from 'react';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { BellRing, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const UpcomingTasksPanel = ({ tasks, currentTime }) => {
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Filter tasks yang akan dimulai dalam 30 menit ke depan
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setVisibleTasks([]);
      return;
    }

    const upcoming = tasks
      .filter((task) => {
        if (task.status !== 'todo' || !task.scheduled_at) return false;

        const diffInMinutes =
          (new Date(task.scheduled_at) - currentTime) / 60000;
        // Tampilkan task yang scheduled 30 menit ke depan dan belum berlalu
        return diffInMinutes > 0 && diffInMinutes <= 30;
      })
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
      .slice(0, 5); // Tampilkan maksimal 5 task

    setVisibleTasks(upcoming);
  }, [tasks, currentTime]);

  // if (visibleTasks.length === 0) {
  //   return null;
  // }

  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative w-fit">
          <Button variant="outline" size="icon-sm">
            <BellRing />
          </Button>
          <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums">
            3
          </Badge>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default UpcomingTasksPanel;
