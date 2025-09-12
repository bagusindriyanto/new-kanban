import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <div className="flex flex-col h-[150px] gap-y-2 bg-neutral-300 rounded-lg m-3 p-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[55px]" />
      </div>
      <Skeleton className="h-3 w-[80px]" />
      <Skeleton className="h-3 mt-1" />
      <Skeleton className="h-3" />
      <Skeleton className="h-3" />
      <div className="flex flex-row-reverse justify-between items-center">
        <div className="flex gap-1">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
