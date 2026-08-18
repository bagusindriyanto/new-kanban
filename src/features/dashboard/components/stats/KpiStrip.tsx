import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Dashboard } from '@/types/dashboard';
import {
  CircleCheckBigIcon,
  CircleDotIcon,
  LayoutListIcon,
  LoaderIcon,
} from 'lucide-react';

const KpiStrip = ({
  summary,
}: {
  summary: Dashboard['stats']['summary'] | undefined;
}) => {
  return (
    <div className="overflow-hidden rounded-4xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-normal text-sm">Total To Do</CardTitle>
            <CardAction>
              <CircleDotIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl leading-none tracking-tight tabular-nums">
              {summary?.todo ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-normal text-sm">
              Total On Progress
            </CardTitle>
            <CardAction>
              <LoaderIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl leading-none tracking-tight tabular-nums">
              {summary?.on_progress ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-normal text-sm">Total Done</CardTitle>
            <CardAction>
              <CircleCheckBigIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl leading-none tracking-tight tabular-nums">
              {summary?.done ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-normal text-sm">
              Total Aktivitas
            </CardTitle>
            <CardAction>
              <LayoutListIcon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl leading-none tracking-tight tabular-nums">
              {summary?.total ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KpiStrip;
