import type { ChartConfig } from '@/components/evilcharts/ui/recharts-chart';
import type { PieChartData } from '../schemas/dashboardSchema';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
  'var(--chart-9)',
  'var(--chart-10)',
] as const;

const usePieChartData = (rawData: PieChartData['tasks']) => {
  if (!rawData || rawData.length === 0)
    return { chartData: [], chartConfig: {} };

  const sortedData = [...rawData].sort(
    (a, b) => b.effective_minute - a.effective_minute,
  );
  const topTasks = sortedData.slice(0, 5);
  const otherTasks = sortedData.slice(5);
  const { otherTotalMinute, otherTasksCount } = otherTasks.reduce(
    (acc, task) => {
      acc.otherTotalMinute += task.effective_minute;
      acc.otherTasksCount += task.tasks_count;
      return acc;
    },
    { otherTotalMinute: 0, otherTasksCount: 0 },
  );

  const finalData = [...topTasks];
  if (otherTotalMinute > 0) {
    finalData.push({
      content: 'Lainnya',
      effective_minute: otherTotalMinute,
      tasks_count: otherTasksCount,
    });
  }

  const chartConfig: ChartConfig = {};

  const chartData = finalData.map((task, index) => {
    const key = task.content
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const isOthers = task.content === 'Lainnya';
    const color = isOthers
      ? 'var(--muted-foreground)'
      : COLORS[index % COLORS.length];

    chartConfig[key] = {
      label: task.content,
      colors: {
        light: [color],
        dark: [color],
      },
    };

    return {
      ...task,
      content: key,
    };
  });

  return { chartData, chartConfig };
};

export default usePieChartData;
