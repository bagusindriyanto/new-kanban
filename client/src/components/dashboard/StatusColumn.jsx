import TaskCard from '../tasks/TaskCard';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/react';

const StatusColumn = ({ title, columnId, tasks }) => {
  const { ref, isDropTarget } = useDroppable({
    id: columnId,
  });

  return (
    <div className="flex flex-col flex-1 overflow-clip rounded-lg border shadow-sm border-border/70">
      <h2
        className={cn(
          'text-lg font-semibold p-3 border-b border-border/70 bg-muted/20 tracking-tight',
          {
            'text-todo-500': title === 'To Do',
            'text-progress-500': title === 'On Progress',
            'text-done-500': title === 'Done',
            'text-archived-500': title === 'Archived',
            'dark:text-archived-400': title === 'Archived',
          },
        )}
      >
        {title}
      </h2>
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto bg-muted/50 dark:bg-muted/10 transition-colors duration-200 flex flex-col p-3 gap-3',
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
