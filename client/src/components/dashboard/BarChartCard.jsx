import { useMemo, useState } from 'react';
import { formatDuration } from '@/utils/formatDuration';
import {
  Card,
  CardAction,
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

const BarChartCard = ({ pics = EMPTY_PICS }) => {
  // Default ke PIC pertama
  const [selectedPicId, setSelectedPicId] = useState(null);

  // Build items untuk Select dropdown
  const picItems = useMemo(() => {
    return pics.map((pic) => ({
      label: pic.pic_name,
      value: pic.pic_id,
    }));
  }, [pics]);

  // Auto-select PIC pertama jika belum ada yang dipilih
  const activePicId = selectedPicId ?? pics[0]?.pic_id ?? null;

  // Ambil rows dari PIC yang aktif, lalu map ke format chartConfig
  const chartData = useMemo(() => {
    const pic = pics.find((p) => p.pic_id === activePicId);
    if (!pic) return [];

    return pic.rows.map((row) => ({
      date: row.date,
      activity_minute: row.total_minutes,
      working_minute: row.working_minute,
    }));
  }, [pics, activePicId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
        <CardDescription>
          Perbandingan lama aktivitas dengan lama bekerja.
        </CardDescription>
        {picItems.length > 0 && (
          <CardAction>
            <Select
              items={picItems}
              value={activePicId}
              onValueChange={setSelectedPicId}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="end">
                <SelectGroup>
                  {picItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardAction>
        )}
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
          <ChartContainer config={chartConfig} className="w-full max-h-96">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 18 }}>
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
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
