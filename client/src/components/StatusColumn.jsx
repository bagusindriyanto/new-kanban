import TaskCard from './TaskCard';
import { SkeletonCard } from './SkeletonCard';
import { ScrollArea } from '@/components/ui/scroll-area';
// Import untuk infinite scroll
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { fetchTasksByStatus } from '@/api/tasks';
import useFilter from '@/stores/filterStore';

const StatusColumn = ({ status, title }) => {
  const picId = useFilter((state) => state.picId);
  const {
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status: condition,
  } = useInfiniteQuery({
    queryKey: ['tasks', { status, picId }],
    queryFn: fetchTasksByStatus,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
  const { ref, inView } = useInView();

  // Ambil halaman berikutnya ketika di scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Ambil tasks dari hasil query
  const tasks = data?.pages.flatMap((page) => page.data) || [];

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
        {condition === 'pending' ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : condition === 'error' ? (
          <div>Error: {error.message}</div>
        ) : (
          <>
            <div className="flex flex-col flex-1 gap-3 py-3">
              {tasks?.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            <div ref={ref}>
              {isFetchingNextPage ? (
                <p className="text-center text-sm mb-3">Memuat lainnya...</p>
              ) : hasNextPage ? (
                <p className="text-center text-sm mb-3">
                  Scroll untuk memuat lainnya
                </p>
              ) : null}
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default StatusColumn;
