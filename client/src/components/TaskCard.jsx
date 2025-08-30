import { useDraggable } from '@dnd-kit/core';

const TaskCard = ({ id, status, content, detail }) => {
  // Hooks untuk elemen draggable
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id,
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
      className={`cursor-grab rounded-lg p-4 shadow-sm hover:shadow-lg bg-linear-135
        ${isDragging ? 'scale-105' : ''}
        ${status === 'todo' ? 'from-rose-500 to-rose-600' : ''} 
        ${status === 'on progress' ? 'from-orange-500 to-orange-600' : ''} 
        ${status === 'done' ? 'from-green-500 to-green-600' : ''}
        ${status === 'archived' ? 'from-gray-500 to-gray-600' : ''}`}
    >
      <h3 className="font-medium text-lg text-white">{content}</h3>
      <p className="mt-2 text-sm text-white">{detail}</p>
    </div>
  );
};

export default TaskCard;
