import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const Column = ({ id, title, pics, tasks }) => {
  // Hooks untuk element droppable
  const { setNodeRef, over } = useDroppable({ id });

  return (
    <div
      className={`flex flex-1 w-80 flex-col rounded-lg bg-neutral-100 p-4 ${
        over?.id === id &&
        'bg-neutral-200 outline-2 outline-blue-500 outline-dashed'
      }`}
    >
      <h2
        className={`text-xl mb-4 font-semibold
        ${title === 'TO DO' ? 'text-rose-600' : ''} 
        ${title === 'ON PROGRESS' ? 'text-orange-600' : ''} 
        ${title === 'DONE' ? 'text-green-600' : ''}
        ${title === 'ARCHIVED' ? 'text-slate-600' : ''}`}
      >
        {title}
      </h2>
      <div ref={setNodeRef} className="flex flex-col flex-1 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            picName={pics.find((p) => p.id === task.pic_id)?.name}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
