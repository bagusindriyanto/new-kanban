import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const UserStatsCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <Card
      className={cn(
        'overflow-hidden p-4 shadow-sm bg-linear-to-b from-card to-muted/30',
        className,
      )}
    >
      {/* Avatar & Name skeleton */}
      <div className="flex flex-col gap-2 items-center pt-2">
        <Skeleton className="size-14 rounded-full" />
        <div className="mt-1 text-center">
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
      </div>

      <Separator />

      {/* Progress bar skeleton */}
      <Skeleton className="w-full h-2 rounded-full" />

      {/* Stats list skeleton — 4 rows (todo, on_progress, done, total) */}
      <div className="flex flex-col gap-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="flex gap-2 items-center">
              <Skeleton className="size-1.5 rounded-full" />
              <Skeleton className="h-3.5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-3.5 w-6 rounded-md" />
          </div>
        ))}

        {/* Completion row skeleton */}
        <div className="flex items-center justify-between pt-1.5">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-8 rounded-md" />
        </div>
      </div>

      <Separator />
      {/* Operational Time skeleton */}
      <div className="flex flex-col gap-1.5 pt-1.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-8 rounded-md" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-8 rounded-md" />
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-8 rounded-md" />
        </div>
      </div>
    </Card>
  );
};

export default UserStatsCardSkeleton;
