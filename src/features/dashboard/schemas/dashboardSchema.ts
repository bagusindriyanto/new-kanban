import z from 'zod';

const userStatsSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  avatar: z.string().nullable(),
  todo: z.coerce.number(),
  on_progress: z.coerce.number(),
  done: z.coerce.number(),
  total: z.coerce.number(),
  effective_minute: z.coerce.number(),
  working_minute: z.coerce.number(),
});

const tableDataSchema = z.object({
  user_id: z.string(),
  content: z.string(),
  sum_effective_minute: z.coerce.number(),
  avg_effective_minute: z.coerce.number(),
  tasks_count: z.coerce.number(),
  user: z.object({
    id: z.string(),
    profile: z.object({
      full_name: z.string(),
      avatar: z.string().nullable(),
    }),
    role: z.string(),
  }),
});

const chartDataSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  chart_data: z.array(
    z.object({
      date: z.string(),
      effective_minute: z.coerce.number(),
      working_minute: z.coerce.number(),
    }),
  ),
});

const pieChartDataSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  avatar: z.string().nullable(),
  tasks: z.array(
    z.object({
      content: z.string(),
      effective_minute: z.coerce.number(),
      tasks_count: z.coerce.number(),
    }),
  ),
});

export const dashboardSchema = z.object({
  division: z.string().optional().default(''),
  stats: z.object({
    summary: z
      .object({
        todo: z.coerce.number(),
        on_progress: z.coerce.number(),
        done: z.coerce.number(),
        total: z.coerce.number(),
      })
      .default({
        todo: 0,
        on_progress: 0,
        done: 0,
        total: 0,
      }),
    users: z.array(userStatsSchema).default([]),
  }),
  table: z.object({
    rows: z.array(tableDataSchema).default([]),
    rows_count: z.coerce.number().default(0),
  }),
  chart: z.object({
    max_minute: z.coerce.number().default(0),
    charts: z.array(chartDataSchema).default([]),
  }),
  pie_chart: z.array(pieChartDataSchema).default([]),
});

export type UserStats = z.infer<typeof userStatsSchema>;
export type TableData = z.infer<typeof tableDataSchema>;
export type ChartData = z.infer<typeof chartDataSchema>;
export type PieChartData = z.infer<typeof pieChartDataSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
