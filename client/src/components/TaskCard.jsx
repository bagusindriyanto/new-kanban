import { useDraggable } from '@dnd-kit/core';

const TaskCard = ({ id, status, title, description }) => {
  // Hooks untuk elemen draggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-grab rounded-lg p-4 shadow-sm hover:shadow-md bg-linear-135
        ${status === 'TODO' ? 'from-rose-500 to-rose-600' : ''} 
        ${status === 'IN_PROGRESS' ? 'from-orange-500 to-orange-600' : ''} 
        ${status === 'DONE' ? 'from-green-500 to-green-600' : ''}
        ${status === 'ARCHIVED' ? 'from-gray-500 to-gray-600' : ''}`}
    >
      <h3 className="font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm text-white">{description}</p>
    </div>
  );
};

export default TaskCard;
