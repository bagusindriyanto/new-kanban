import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const StatusColumn = ({ title, tasks }) => {
  return (
    <div
      className={`flex flex-1 flex-col rounded-lg overflow-clip bg-neutral-100`}
    >
      <h2
        className={`text-xl font-semibold py-4 px-3 border-b border-border bg-neutral-50
        ${title === 'TO DO' ? 'text-todo-600' : ''} 
        ${title === 'ON PROGRESS' ? 'text-progress-600' : ''} 
        ${title === 'DONE' ? 'text-done-600' : ''}
        ${title === 'ARCHIVED' ? 'text-archived-600' : ''}`}
      >
        {title}
      </h2>
      <ScrollArea className="flex-1 max-h-[calc(85.5dvh-56px-39px)] px-3 bg-neutral-100">
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
