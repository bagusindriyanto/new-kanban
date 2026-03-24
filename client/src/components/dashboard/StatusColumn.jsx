import TaskCard from '../tasks/TaskCard';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/react';

const StatusColumn = ({ title, columnId, tasks }) => {
  const { ref, isDropTarget } = useDroppable({
    id: columnId,
  });

  return (
    <div
      className={cn(
        'flex flex-col flex-1 overflow-clip rounded-lg border shadow-sm border-border/70',
        {
          'bg-todo': title === 'To Do',
          'bg-progress': title === 'On Progress',
          'bg-pending': title === 'Pending',
          'bg-done': title === 'Done',
        },
      )}
    >
      <h2
        className={cn('text-lg font-semibold p-3 tracking-tight', {
          'text-todo-foreground': title === 'To Do',
          'text-progress-foreground': title === 'On Progress',
          'text-pending-foreground': title === 'Pending',
          'text-done-foreground': title === 'Done',
        })}
      >
        {title}
      </h2>
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto transition-colors duration-200 flex flex-col p-3 gap-3',
          '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar-thumb]:relative',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300',
          'dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500',
          {
            'bg-primary/5 dark:bg-primary/10 ring-2 ring-inset ring-primary/30':
              isDropTarget,
          },
        )}
      >
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default StatusColumn;
