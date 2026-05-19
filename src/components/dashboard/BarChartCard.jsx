import { formatDuration } from '@/utils/formatDuration';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  EvilBarChart,
  Bar,
  XAxis,
  YAxis,
  Grid,
} from '@/components/evilcharts/charts/bar-chart';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Ban } from 'lucide-react';
import { ChartTooltip, ChartTooltipContent } from '../evilcharts/ui/tooltip';
import { ChartBackground } from '../evilcharts/ui/background';

const getChartConfig = (name) => {
  if (!name) {
    return {
      total_minutes: {
        label: 'Aktivitas',
        colors: { light: ['hsl(0, 0%, 40%)'], dark: ['hsl(0, 0%, 40%)'] },
      },
      working_minutes: {
        label: 'Waktu Kerja',
        colors: { light: ['hsl(0, 0%, 60%)'], dark: ['hsl(0, 0%, 60%)'] },
      },
    };
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return {
    total_minutes: {
      label: 'Aktivitas',
      colors: {
        light: [`hsl(${hue}, 70%, 40%)`],
        dark: [`hsl(${hue}, 70%, 40%)`],
      },
    },
    working_minutes: {
      label: 'Waktu Kerja',
      colors: {
        light: [`hsl(${hue}, 70%, 60%)`],
        dark: [`hsl(${hue}, 70%, 60%)`],
      },
    },
  };
};

const EmptyChartItem = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ban />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
};

const BarChartCard = ({ data }) => {
  const maxMinutes = data?.max_minutes || 2 * 60;
  const ticks = Array.from({ length: 5 }).map((_, i) => (i * maxMinutes) / 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
        <CardDescription>
          Perbandingan lama aktivitas dengan lama bekerja.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {data?.pics.length === 0 ? (
          <EmptyChartItem />
        ) : (
          data?.pics.map(({ pic_id, pic_name, rows }) => (
            <div key={pic_id} className="space-y-2">
              <h2 className="font-semibold tracking-tight">{pic_name}</h2>
              <EvilBarChart
                data={rows}
                config={getChartConfig(pic_name)}
                className="w-full h-full max-h-50 p-4"
              >
                <ChartBackground variant="grid" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('id', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  tick={{
                    fontSize: 10,
                  }}
                />
                <YAxis
                  ticks={ticks}
                  tickFormatter={(value) => formatDuration(value)}
                  tick={{
                    style: { fontVariantNumeric: 'tabular-nums' },
                    fontSize: 10,
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('id');
                      }}
                      formatter={(value, name) => (
                        <div className="flex flex-1 items-center gap-2">
                          <div
                            className="size-2.5 shrink-0 rounded-[2px]"
                            style={{
                              background: `var(--color-${name}-0)`,
                            }}
                          />
                          <span className="flex-1">{name}</span>
                          <span className="text-muted-foreground font-medium tabular-nums">
                            {formatDuration(value)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="total_minutes" variant="default" />
                <Bar dataKey="working_minutes" variant="default" />
              </EvilBarChart>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
