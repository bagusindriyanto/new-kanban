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
import { BanIcon } from 'lucide-react';
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EMPTY_DATA = [];

const items = [
  { label: 'Top 3', value: 3 },
  { label: 'Top 5', value: 5 },
  { label: 'Top 10', value: 10 },
];

const PieChartCard = ({ data = EMPTY_DATA }) => {
  const [limit, setLimit] = useState(5);
  const { chartData, chartConfig } = usePieChartData(data, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proporsi Aktivitas</CardTitle>
        <CardDescription>
          Menampilkan proporsi setiap aktivitas.
        </CardDescription>
        <CardAction>
          <Select items={items} value={limit} onValueChange={setLimit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="end">
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        {chartData.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BanIcon />
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
                        <div className="flex gap-1 items-baseline ml-auto font-medium tabular-nums text-foreground">
                          {value}
                          <span className="font-normal text-muted-foreground">
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
