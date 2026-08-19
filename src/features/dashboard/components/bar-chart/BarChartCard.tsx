import { formatDuration } from '@/utils/formatDuration';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { BanIcon } from 'lucide-react';
import type { ChartData } from '@/types/dashboard';
import { EvilBarChart } from '@/components/evilcharts/charts/recharts-bar-chart';

type ChartConfig = {
  effective_minute: {
    label: 'Aktivitas';
    colors: { light: string[]; dark: string[] };
  };
  working_minute: {
    label: 'Waktu Kerja';
    colors: { light: string[]; dark: string[] };
  };
};

const getChartConfig = (name: string): ChartConfig => {
  if (!name) {
    return {
      effective_minute: {
        label: 'Aktivitas',
        colors: { light: ['hsl(0, 0%, 40%)'], dark: ['hsl(0, 0%, 40%)'] },
      },
      working_minute: {
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
    effective_minute: {
      label: 'Aktivitas',
      colors: {
        light: [`hsl(${hue}, 70%, 40%)`],
        dark: [`hsl(${hue}, 70%, 40%)`],
      },
    },
    working_minute: {
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
          <BanIcon />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
};

const BarChartCard = ({
  data,
}: {
  data:
    | {
        max_minute: number;
        charts: ChartData[];
      }
    | undefined;
}) => {
  const maxMinute = data?.max_minute || 2 * 60;
  const ticks = Array.from({ length: 5 }).map((_, i) => (i * maxMinute) / 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
        <CardDescription>
          Perbandingan lama aktivitas dengan lama bekerja.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {!data?.charts || data.charts.length === 0 ? (
          <EmptyChartItem />
        ) : (
          data.charts.map(({ id, full_name, chart_data }) => {
            const chartConfig = getChartConfig(full_name);
            return (
              <div key={id} className="space-y-2">
                <h2 className="font-semibold tracking-tight">{full_name}</h2>
                <EvilBarChart
                  data={chart_data}
                  config={chartConfig}
                  className="size-full max-h-100 p-4"
                  barRadius={4}
                  chartProps={{ maxBarSize: 100 }}
                >
                  <EvilBarChart.Grid />
                  <EvilBarChart.Legend />
                  <EvilBarChart.XAxis
                    dataKey="date"
                    tickFormatter={(value: string) => {
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
                  <EvilBarChart.YAxis
                    ticks={ticks}
                    tickFormatter={(value: number) => formatDuration(value)}
                    tick={{
                      style: { fontVariantNumeric: 'tabular-nums' },
                      fontSize: 10,
                    }}
                  />
                  <EvilBarChart.Tooltip />
                  <EvilBarChart.Bar
                    dataKey="effective_minute"
                    variant="default"
                  />
                  <EvilBarChart.Bar
                    dataKey="working_minute"
                    variant="default"
                  />
                </EvilBarChart>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
