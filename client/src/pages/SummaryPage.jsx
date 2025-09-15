import { useState, useEffect, useMemo } from 'react';
import useActivities from '@/stores/activityStore';
import { TrendingUp, TrendingDown, CalendarIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
// Komponen Filter
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link } from 'react-router';
import usePics from '@/stores/picStore';
import useTasks from '@/stores/taskStore';

const SummaryPage = () => {
  // State
  const pics = usePics((state) => state.pics);
  const tasks = useTasks((state) => state.tasks);
  const [selectedPicId, setSelectedPicId] = useState('all');
  const [range, setRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Urutkan dan filter task berdasarkan PIC
  const sortedTasks = useMemo(() => {
    // Sorting
    let result = [...tasks].sort(
      (a, b) => new Date(a.timestamp_done) - new Date(b.timestamp_done)
    );
    // Filtering
    if (selectedPicId !== 'all') {
      result = result.filter((task) => task.pic_id === selectedPicId);
    }
    return result;
  }, [tasks, selectedPicId]);

  // Data pada Card
  const totalActivity = sortedTasks.length;
  const totalActivityMinutes = sortedTasks.reduce(
    (sum, task) => sum + task.minute_activity,
    0
  );
  const totalTodoActivity = sortedTasks.filter(
    (task) => task.status === 'todo'
  ).length;
  const totalProgressActivity = sortedTasks.filter(
    (task) => task.status === 'on progress'
  ).length;
  const totalDoneActivity = sortedTasks.filter(
    (task) => task.status === 'done'
  ).length;

  // Data pada Chart
  const chartData = Object.values(
    sortedTasks.reduce((acc, task) => {
      if (!task.timestamp_done) return acc;
      // Ambil tanggal saja (YYYY-MM-DD)
      const date = task.timestamp_done.split('T')[0];
      // Kalau belum ada, buat object baru
      if (!acc[date]) {
        acc[date] = { date, minute_activity: 0, minute_pause: 0 };
      }
      // Tambahkan minute_activity dan minute_pause
      acc[date].minute_activity += task.minute_activity;
      acc[date].minute_pause += task.minute_pause;
      return acc;
    }, {})
  );

  // const filteredChartData = useMemo(() => {
  //   if (!range?.from && !range?.to) {
  //     return chartData;
  //   }
  //   return chartData.filter((task) => {
  //     const date = new Date(task.date);
  //     return date >= range.from && date <= range.to;
  //   });
  // }, [range]);

  // Fungsi panggil data
  // const fetchActivities = useActivities((state) => state.fetchActivities);
  // const fetchPics = usePics((state) => state.fetchPics);
  // const fetchTasks = useTasks((state) => state.fetchTasks);

  // // Ambil tasks ketika halaman dimuat
  // useEffect(() => {
  //   const fetchAll = () => {
  //     fetchActivities();
  //     fetchPics();
  //     fetchTasks();
  //   };
  //   fetchAll();
  //   const interval = setInterval(fetchAll, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  const chartConfig = {
    minute_activity: {
      label: 'Activity',
      color: 'var(--chart-1)',
    },
    minute_pause: {
      label: 'Pause',
      color: 'var(--chart-2)',
    },
  };

  return (
    <>
      <h1>Halaman Summary</h1>
      <Link to="/">Kembali ke halaman utama</Link>
      {/* Filter PIC */}
      <Select value={selectedPicId} onValueChange={setSelectedPicId}>
        <SelectTrigger className="w-[160px] bg-neutral-100">
          <SelectValue placeholder="Pilih PIC" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>PIC</SelectLabel>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value={null}>-</SelectItem>
            {pics.map((pic) => (
              <SelectItem value={pic.id} key={pic.id}>
                {pic.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Akhir Filter PIC */}
      {/* Filter Tanggal */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon />
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString(
                  'id'
                )} - ${range.to.toLocaleDateString('id')}`
              : 'Pilih Tanggal'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            className="w-full"
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={setRange}
            startMonth={range?.from}
            fixedWeeks
            showOutsideDays
          />
        </PopoverContent>
      </Popover>
      {/* Akhir Tanggal */}
      {/* Card */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-linear-to-t from-todo-500/40 to-card border-none">
          <CardHeader>
            <CardDescription>Total To Do Activity</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalTodoActivity} Aktivitas
            </CardTitle>
            <CardAction>
              {/* <Badge variant="outline">
                <TrendingDown />
                -20%
              </Badge> */}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium"></div>
            <div className="text-muted-foreground"></div>
          </CardFooter>
        </Card>
        <Card className="bg-linear-to-t from-progress-500/40 to-card border-none">
          <CardHeader>
            <CardDescription>Total On Progress Activity</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalProgressActivity} Aktivitas
            </CardTitle>
            <CardAction>
              {/* <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge> */}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium"></div>
            <div className="text-muted-foreground"></div>
          </CardFooter>
        </Card>
        <Card className="bg-linear-to-t from-done-500/40 to-card border-none">
          <CardHeader>
            <CardDescription>Total Done Activty</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalDoneActivity} Aktivitas
            </CardTitle>
            <CardAction>
              {/* <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge> */}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium"></div>
            <div className="text-muted-foreground"></div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Rata-Rata Lama Activity</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Math.round(totalActivityMinutes / totalActivity) || 0} Menit
            </CardTitle>
            <CardAction>
              {/* <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge> */}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total Activity: {totalActivity} Aktivitas
            </div>
            <div className="text-muted-foreground">
              Total Activity Minutes: {totalActivityMinutes} Menit
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* Chart */}
      <div className="flex justify-center gap-2">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Activity vs Pause</CardTitle>
            <CardDescription>
              Menampilkan lama activity dan pause.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('id', { weekday: 'short' });
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="minute_activity"
                  fill="var(--color-minute_activity)"
                  radius={4}
                />
                <Bar
                  dataKey="minute_pause"
                  fill="var(--color-minute_pause)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default SummaryPage;
