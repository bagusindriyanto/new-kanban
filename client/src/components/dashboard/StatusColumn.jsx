import TaskCard from '../tasks/TaskCard';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '@/lib/utils';

const StatusColumn = ({ title, tasks, currentTime }) => {
  return (
    <div className="flex flex-1 flex-col rounded-lg overflow-clip shadow-sm border border-border/70">
      <h2
        className={cn(
          'text-lg font-semibold p-3 border-b border-border/70 bg-muted/20',
          {
            'text-todo-500': title === 'TO DO',
            'text-progress-500': title === 'ON PROGRESS',
            'text-done-500': title === 'DONE',
            'text-archived-500': title === 'ARCHIVED',
            'dark:text-archived-400': title === 'ARCHIVED',
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
            <TaskCard task={task} currentTime={currentTime} />
          </div>
        )}
      />
    </div>
  );
};

export default StatusColumn;
