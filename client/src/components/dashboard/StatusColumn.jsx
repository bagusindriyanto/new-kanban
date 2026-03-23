import TaskCard from '../tasks/TaskCard';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '@/lib/utils';

const StatusColumn = ({ title, tasks }) => {
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
      <Virtuoso
        className="!max-h-[calc(100dvh-52px-35px-24px-60.8px)] bg-muted/50 dark:bg-muted/10
        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar-thumb]:relative 
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        data={tasks}
        itemContent={(_, task) => (
          <div className="px-3 pt-3">
            <TaskCard task={task} />
          </div>
        )}
      />
    </div>
  );
};

export default StatusColumn;
