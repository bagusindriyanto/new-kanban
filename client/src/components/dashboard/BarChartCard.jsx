import { formatDuration } from '@/utils/formatDuration';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EMPTY_PICS = [];

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

const BarChartCard = ({ pics = EMPTY_PICS }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
        <CardDescription>
          Perbandingan lama aktivitas dengan lama bekerja.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {pics.length === 0 ? (
          <EmptyChartItem />
        ) : (
          pics.map(({ pic_id, pic_name, rows }, index) => (
            <div key={pic_id} className="space-y-2">
              <h2>
                {index + 1}. {pic_name}
              </h2>
              <ChartContainer config={chartConfig} className="w-full max-h-30">
                <BarChart accessibilityLayer data={rows} margin={{ top: 18 }}>
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
                    tickFormatter={(value) => formatDuration(value)}
                    tick={{ style: { fontVariantNumeric: 'tabular-nums' } }}
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
                            <div className="text-muted-foreground ml-auto flex items-baseline gap-0.5 font-medium tabular-nums">
                              {formatDuration(value)}
                            </div>
                          </>
                        )}
                      />
                    }
                  />
                  <Bar
                    dataKey="total_minutes"
                    fill="var(--color-total_minutes)"
                    radius={4}
                  >
                    <LabelList
                      position="top"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value) => formatDuration(value)}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
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
                      formatter={(value) => formatDuration(value)}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
