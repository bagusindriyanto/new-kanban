import usePieChartData from '@/hooks/usePieChartData';
import { useState } from 'react';
import {
  Card,
  CardAction,
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
import { Ban } from 'lucide-react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PieChartCard = ({ data = [] }) => {
  const [limit, setLimit] = useState(5);
  const { chartData, chartConfig } = usePieChartData(data, limit);

  return (
    <Card className="md:col-span-2 xl:col-span-3">
      <CardHeader>
        <CardTitle>Proporsi Aktivitas</CardTitle>
        <CardDescription>
          Menampilkan proporsi setiap aktivitas.
        </CardDescription>
        <CardAction>
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={3}>Top 3</SelectItem>
              <SelectItem value={5}>Top 5</SelectItem>
              <SelectItem value={10}>Top 10</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        {chartData.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Ban />
              </EmptyMedia>
              <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto max-h-96"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                          style={{
                            '--color-bg': `var(--color-${name})`,
                          }}
                        />
                        {chartConfig[name]?.label || name}
                        <div className="text-foreground ml-auto flex items-baseline gap-1 font-medium tabular-nums">
                          {value}
                          <span className="text-muted-foreground font-normal">
                            menit
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="total_minutes"
                nameKey="content"
                label={({ percent }) => {
                  return `${(percent * 100).toFixed(1)}%`;
                }}
              />
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="content"
                    className="translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
