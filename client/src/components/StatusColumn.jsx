import TaskCard from './TaskCard';
import { SkeletonCard } from './SkeletonCard';
import { ScrollArea } from '@/components/ui/scroll-area';
// Import untuk infinite scroll
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { fetchTasksByStatus } from '@/api/tasks';

const StatusColumn = ({ status, title }) => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['tasks', status],
    queryFn: fetchTasksByStatus,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    staleTime: 5 * 60 * 1000,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const tasks = data?.pages.flatMap((page) => page.tasks) || [];
  // console.log(data);
  console.log(tasks);
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
        {isLoading && <SkeletonCard />}
        {error && <div>Error: {error.message}</div>}
        <div className="flex flex-col flex-1 gap-3 py-3">
          {tasks?.map((task) => (
            <TaskCard key={task.id} task={task} />
            // <div className="w-full h-[150px] border-2 border-white">
            // {task?.content}
            // </div>
          ))}
        </div>
        <div ref={ref} className="mb-">
          {isFetchingNextPage ? (
            <div className="h-[20px] text-center">Loading more...</div>
          ) : hasNextPage ? (
            <div className="h-[20px] text-center">Scroll to load more</div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusColumn;
