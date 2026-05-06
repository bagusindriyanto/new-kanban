import { CircleCheckBig, CircleDot, LayoutList, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ProfileAvatar from '../shared/ProfileAvatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const statItems = [
  {
    key: 'todo',
    label: 'To Do',
    icon: CircleDot,
    textClass: 'text-todo-accent',
    dotClass: 'bg-todo-accent',
  },
  {
    key: 'on_progress',
    label: 'On Progress',
    icon: Loader,
    textClass: 'text-progress-accent',
    dotClass: 'bg-progress-accent',
  },
  {
    key: 'done',
    label: 'Done',
    icon: CircleCheckBig,
    textClass: 'text-done-accent',
    dotClass: 'bg-done-accent',
  },
  {
    key: 'total',
    label: 'Total',
    icon: LayoutList,
    textClass: 'text-total-accent',
    dotClass: 'bg-total-accent',
  },
];

const UserStatsCard = ({ user, className }) => {
  // Calculate completion percentage
  const todo = user.todo ?? 0;
  const onProgress = user.on_progress ?? 0;
  const done = user.done ?? 0;
  const total = user.total ?? 0;

  const todoPercent = total > 0 ? Math.round((todo / total) * 100) : 0;
  const onProgressPercent =
    total > 0 ? Math.round((onProgress / total) * 100) : 0;
  const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card
      className={cn(
        'overflow-hidden p-4 shadow-sm bg-linear-to-b from-card to-muted/30',
        className,
      )}
    >
      {/* Avatar & Name — centered */}
      <div className="flex flex-col gap-2 items-center pt-2">
        <ProfileAvatar profile={user} className="text-lg size-14" />
        <div className="mt-1 text-center">
          <p className="text-sm font-semibold leading-tight truncate max-w-[180px]">
            {user.full_name}
          </p>
        </div>
      </div>

      <Separator />

      {/* Bar tasks */}
      <div className="overflow-hidden w-full h-2 rounded-full bg-muted">
        <div className="flex w-full h-full">
          <div
            className="h-full bg-todo-accent transition-[width] duration-600 ease-[cubic-bezier(0.76, 0, 0.24, 1)]"
            style={{ width: `${todoPercent}%` }}
          />
          <div
            className="h-full bg-progress-accent transition-[width] duration-600 ease-[cubic-bezier(0.76, 0, 0.24, 1)]"
            style={{ width: `${onProgressPercent}%` }}
          />
          <div
            className="h-full bg-done-accent transition-[width] duration-600 ease-[cubic-bezier(0.76, 0, 0.24, 1)]"
            style={{ width: `${donePercent}%` }}
          />
        </div>
      </div>

      {/* Stats List */}
      <div className="flex flex-col gap-0">
        {statItems.map(({ key, label, textClass, dotClass }) => (
          <div key={key} className="flex items-center justify-between py-1.5">
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <span className={`size-1.5 rounded-full ${dotClass}`} />
              {label}
            </div>
            <span className={`text-sm font-bold tabular-nums ${textClass}`}>
              {user[key] ?? 0}
            </span>
          </div>
        ))}

        {/* Completion row */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-muted-foreground">Completion</span>
          <span className="text-sm font-bold tabular-nums text-primary">
            {completion}%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default UserStatsCard;
