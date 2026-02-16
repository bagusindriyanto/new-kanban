import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { chartConfig } from '@/config/chartConfig';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Ban } from 'lucide-react';

const BarChartCard = ({ data = [] }) => {
  return (
    <Card className="w-full md:col-span-2 xl:col-span-3">
      <CardHeader>
        <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
        <CardDescription>
          Perbandingan lama aktivitas dengan lama bekerja.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Ban />
              </EmptyMedia>
              <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer config={chartConfig} className="w-full max-h-96">
            <BarChart accessibilityLayer data={data} margin={{ top: 18 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('id', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('id');
                    }}
                    className="w-[180px]"
                    formatter={(value, name) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                          style={{
                            '--color-bg': `var(--color-${name})`,
                          }}
                        />
                        {chartConfig[name]?.label || name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-medium tabular-nums">
                          {value}
                          <span className="ml-0.5 text-muted-foreground font-normal">
                            menit
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="activity_minute"
                fill="var(--color-activity_minute)"
                radius={4}
              >
                <LabelList
                  position="top"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar
                dataKey="working_minute"
                fill="var(--color-working_minute)"
                radius={4}
              >
                <LabelList
                  position="top"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
