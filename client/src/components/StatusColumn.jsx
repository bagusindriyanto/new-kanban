import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const StatusColumn = ({ title, tasks }) => {
  return (
    <div className="flex flex-1 flex-col rounded-lg overflow-clip">
      <h2
        className={`text-xl font-semibold py-4 px-3 border-b border-border bg-neutral-50 dark:bg-neutral-900
        ${title === 'TO DO' ? 'text-todo-500' : ''} 
        ${title === 'ON PROGRESS' ? 'text-progress-500' : ''} 
        ${title === 'DONE' ? 'text-done-500' : ''}
        ${
          title === 'ARCHIVED' ? 'text-archived-500 dark:text-neutral-400' : ''
        }`}
      >
        {title}
      </h2>
      <ScrollArea className="flex-1 max-h-[calc(100dvh-56px-39px-32px-60.8px)] px-3 bg-neutral-100 dark:bg-neutral-900/80">
        <div className="flex flex-col flex-1 gap-3 py-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusColumn;
