import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const StatusColumn = ({ title, tasks }) => {
  return (
    <div className={`flex flex-1 flex-col rounded-lg bg-neutral-100`}>
      <h2
        className={`text-xl mb-4 font-semibold pt-4 px-4
        ${title === 'TO DO' ? 'text-todo-600' : ''} 
        ${title === 'ON PROGRESS' ? 'text-progress-600' : ''} 
        ${title === 'DONE' ? 'text-done-600' : ''}
        ${title === 'ARCHIVED' ? 'text-archived-600' : ''}`}
      >
        {title}
      </h2>
      <ScrollArea className="flex-1 max-h-[calc(85.5dvh-56px-39px)] px-4">
        <div className="flex flex-col flex-1 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusColumn;
