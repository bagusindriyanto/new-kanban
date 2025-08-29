import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const Column = ({ id, title, tasks }) => {
  // Hooks untuk element droppable
  const { setNodeRef } = useDroppable({ id: id });

  return (
    <div className="flex flex-1 w-80 flex-col rounded-lg bg-neutral-100 p-4">
      <h2
        className={`text-xl mb-4 font-semibold
        ${title === 'To Do' ? 'text-rose-600' : ''} 
        ${title === 'In Progress' ? 'text-orange-600' : ''} 
        ${title === 'Done' ? 'text-green-600' : ''}
        ${title === 'Archived' ? 'text-slate-600' : ''}`}
      >
        {title}
      </h2>
      <div ref={setNodeRef} className="flex flex-col flex-1 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            status={task.status}
            title={task.title}
            description={task.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
