import { useMemo } from 'react';

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
];

const usePieChartData = (rawData, limit = 5) => {
  return useMemo(() => {
    if (!rawData || rawData.length === 0)
      return { chartData: [], chartConfig: {} };

    const sortedData = [...rawData].sort(
      (a, b) => b.total_minutes - a.total_minutes,
    );
    const topTasks = sortedData.slice(0, limit);
    const otherTasks = sortedData.slice(limit);
    const otherTotal = otherTasks.reduce(
      (acc, task) => acc + task.total_minutes,
      0,
    );

    const finalData = [...topTasks];
    if (otherTotal > 0) {
      finalData.push({ content: 'Lainnya', total_minutes: otherTotal });
    }

    const config = {
      total_minutes: { label: 'Total Durasi' },
    };

    const chartData = finalData.map((task, index) => {
      const key = task.content.toLowerCase().replace(/\s+/g, '_');
      const isOthers = task.content === 'Lainnya';
      const color = isOthers
        ? 'var(--muted-foreground)'
        : COLORS[index % COLORS.length];

      config[key] = {
        label: task.content,
        color,
      };

      return {
        ...task,
        content: key,
        fill: color,
      };
    });

    return { chartData, chartConfig: config };
  }, [rawData, limit]);
};

export default usePieChartData;
