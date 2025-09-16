import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, CalendarIcon } from 'lucide-react';
import { format, parseISO, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Bar,
  BarChart,
  LabelList,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
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
import { Badge } from '@/components/ui/badge';
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
import { chartConfig } from '@/config/chartConfig';

const SummaryPage = () => {
  // State
  const pics = usePics((state) => state.pics);
  const tasks = useTasks((state) => state.tasks);
  const [selectedPicId, setSelectedPicId] = useState('all');
  const [range, setRange] = useState({
    from: null,
    to: null,
  });

  // Urutkan dan filter task berdasarkan PIC
  const sortedTasks = useMemo(() => {
    // Sorting
    let result = [...tasks].sort(
      (a, b) => new Date(a.timestamp_done) - new Date(b.timestamp_done)
    );
    // Filtering PIC
    if (selectedPicId !== 'all') {
      result = result.filter((task) => task.pic_id === selectedPicId);
    }
    // Filtering Tanggal
    if (!range?.from && !range?.to) {
      return result;
    }
    result = result.filter((task) => {
      if (!task.timestamp_done) return false;
      const date = startOfDay(parseISO(task.timestamp_done));
      return date >= range.from && date <= range.to;
    });

    return result;
  }, [tasks, selectedPicId, range]);

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
      const date = format(task.timestamp_done, 'yyyy-MM-dd');
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
  const fetchPics = usePics((state) => state.fetchPics);
  const fetchTasks = useTasks((state) => state.fetchTasks);

  // Ambil tasks ketika halaman dimuat
  useEffect(() => {
    const fetchAll = () => {
      fetchPics();
      fetchTasks();
    };
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <Button>
          <Link to="/">Kembali ke halaman utama</Link>
        </Button>
        <div className="flex gap-2">
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
                locale={id}
                captionLayout="dropdown"
                defaultMonth={range?.from}
                weekStartsOn={1}
                selected={range}
                onSelect={setRange}
                startMonth={new Date(2011, 12)}
                disabled={(date) =>
                  date > new Date() || date <= new Date('2011-12-31')
                }
              />
            </PopoverContent>
          </Popover>
          {/* Akhir Tanggal */}
        </div>
      </div>
      {/* Card */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-linear-to-t from-todo-500/40 to-card border-none">
          <CardHeader>
            <CardDescription>Total To Do Activity</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalTodoActivity} Aktivitas
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingDown />
                -20%
              </Badge>
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
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium"></div>
            <div className="text-muted-foreground"></div>
            {/* <pre>{JSON.stringify(range)}</pre> */}
          </CardFooter>
        </Card>
        <Card className="bg-linear-to-t from-done-500/40 to-card border-none">
          <CardHeader>
            <CardDescription>Total Done Activty</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalDoneActivity} Aktivitas
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
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
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
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
        {/* Chart */}
        <Card className="w-full md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Minutes</CardTitle>
            <CardDescription>
              Menampilkan lama activity per hari
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
                    return date.toLocaleDateString('id', { weekday: 'long' });
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
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="minute_activity"
                  fill="var(--color-minute_activity)"
                  radius={4}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month
            </div>
            <div className="text-muted-foreground leading-none">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
        </Card>
      </div>
    </>
  );
};

export default SummaryPage;
