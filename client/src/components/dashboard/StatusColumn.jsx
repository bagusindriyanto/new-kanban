import TaskCard from '../tasks/TaskCard';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef } from 'react';

const StatusColumn = ({ title, columnId, tasks }) => {
  // Ref untuk scroll container (dipakai oleh virtualizer + droppable)
  const scrollRef = useRef(null);

  const { ref: droppableRef, isDropTarget } = useDroppable({
    id: columnId,
  });

  const virtualizer = useVirtualizer({
    count: tasks?.length || 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 100,
  });
  const virtualItems = virtualizer.getVirtualItems();

  // Gabungkan droppable ref dan scroll ref
  const mergedRef = useCallback(
    (node) => {
      scrollRef.current = node;

      if (typeof droppableRef === 'function') {
        droppableRef(node);
      }
    },
    [droppableRef],
  );

  return (
    <div
      className={cn(
        'flex flex-col min-h-0 h-full rounded-lg border shadow-sm border-border/70 overflow-clip',
        {
          'bg-todo': title === 'To Do',
          'bg-progress': title === 'On Progress',
          'bg-pending': title === 'Pending',
          'bg-done': title === 'Done',
        },
      )}
    >
      <h2
        className={cn('text-lg font-semibold p-3 tracking-tight', {
          'text-todo-foreground': title === 'To Do',
          'text-progress-foreground': title === 'On Progress',
          'text-pending-foreground': title === 'Pending',
          'text-done-foreground': title === 'Done',
        })}
      >
        {title}
      </h2>
      <div
        ref={mergedRef}
        className={cn(
          'flex-1 overflow-y-auto transition-colors duration-200 rounded-b-lg',
          '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar-thumb]:relative',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300',
          'dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500',
          {
            'bg-primary/5 dark:bg-primary/10 ring-2 ring-inset ring-primary/30':
              isDropTarget,
          },
        )}
      >
        <div
          className="relative w-full"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full space-y-3 first:pt-2 last:pb-3"
            style={{
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualItem) => {
              const task = tasks[virtualItem.index];
              return (
                <div
                  key={task.id}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="px-3"
                >
                  <TaskCard task={task} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusColumn;
