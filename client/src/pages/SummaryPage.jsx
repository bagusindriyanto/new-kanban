import { useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, CalendarIcon } from 'lucide-react';
import { id } from 'date-fns/locale';
import { startOfDay } from 'date-fns';
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
import { chartConfig } from '@/config/chartConfig';
import useSummary from '@/stores/summaryStore';
import useFilter from '@/stores/filterStore';
import { ModeToggle } from '@/components/ModeToggle';
// Data Table
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/columns';

const SummaryPage = () => {
  // Placeholder Table
  const placeholder = [
    { status: 'completed', email: 'alice01@example.com', amount: 250 },
    { status: 'pending', email: 'bob02@example.com', amount: 120 },
    { status: 'failed', email: 'charlie03@example.com', amount: 340 },
    { status: 'completed', email: 'diana04@example.com', amount: 560 },
    { status: 'pending', email: 'edward05@example.com', amount: 90 },
    { status: 'completed', email: 'frank06@example.com', amount: 720 },
    { status: 'failed', email: 'grace07@example.com', amount: 180 },
    { status: 'pending', email: 'henry08@example.com', amount: 430 },
    { status: 'completed', email: 'irene09@example.com', amount: 220 },
    { status: 'failed', email: 'jack10@example.com', amount: 800 },
    { status: 'pending', email: 'kate11@example.com', amount: 310 },
    { status: 'completed', email: 'leo12@example.com', amount: 640 },
    { status: 'failed', email: 'mia13@example.com', amount: 400 },
    { status: 'completed', email: 'nathan14@example.com', amount: 150 },
    { status: 'pending', email: 'olivia15@example.com', amount: 270 },
    { status: 'failed', email: 'peter16@example.com', amount: 960 },
    { status: 'completed', email: 'queen17@example.com', amount: 510 },
    { status: 'pending', email: 'robert18@example.com', amount: 180 },
    { status: 'completed', email: 'susan19@example.com', amount: 770 },
    { status: 'failed', email: 'tom20@example.com', amount: 640 },
    { status: 'completed', email: 'ursula21@example.com', amount: 300 },
    { status: 'pending', email: 'victor22@example.com', amount: 560 },
    { status: 'failed', email: 'wendy23@example.com', amount: 430 },
    { status: 'completed', email: 'xavier24@example.com', amount: 210 },
    { status: 'pending', email: 'yasmine25@example.com', amount: 390 },
    { status: 'failed', email: 'zack26@example.com', amount: 120 },
    { status: 'completed', email: 'anna27@example.com', amount: 850 },
    { status: 'pending', email: 'brian28@example.com', amount: 470 },
    { status: 'failed', email: 'carol29@example.com', amount: 620 },
    { status: 'completed', email: 'derek30@example.com', amount: 700 },
  ];

  // State
  const pics = usePics((state) => state.pics);
  const summary = useSummary((state) => state.summary);
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  const range = useFilter((state) => state.range);
  const setRange = useFilter((state) => state.setRange);

  // Urutkan dan filter task berdasarkan PIC
  const filteredSummary = useMemo(() => {
    // Filtering PIC
    let result = [...summary];
    if (selectedPicId !== 'all') {
      result = result.filter((res) => res.pic_id === selectedPicId);
    } else {
      result = Object.values(
        result.reduce((acc, { date, activity_duration, working_minute }) => {
          // const num = Number(value); // pastikan angka meskipun string
          if (!acc[date]) {
            acc[date] = { date, activity_duration: 0, working_minute: 0 };
          }
          acc[date].activity_duration += activity_duration;
          acc[date].working_minute += working_minute;
          return acc;
        }, {})
      );
    }
    // Filtering Tanggal
    if (!range?.from && !range?.to) {
      return result;
    }
    result = result.filter((res) => {
      if (!res.date) return false;
      const [year, month, day] = res.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date >= range.from && date <= range.to;
    });
    return result;
  }, [summary, selectedPicId, range]);

  // Data pada Card
  const totalTodoActivity = filteredSummary.reduce(
    (sum, res) => sum + res.todo_count,
    0
  );
  const totalProgressActivity = filteredSummary.reduce(
    (sum, res) => sum + res.on_progress_count,
    0
  );
  const totalDoneActivity = filteredSummary.reduce(
    (sum, res) => sum + res.done_count,
    0
  );
  const totalArchivedActivity = filteredSummary.reduce(
    (sum, res) => sum + res.archived_count,
    0
  );
  // const totalActivityMinutes = filteredSummary.reduce(
  //   (sum, res) => sum + res.activity_duration,
  //   0
  // );
  // const totalActivity =
  //   totalTodoActivity +
  //   totalProgressActivity +
  //   totalDoneActivity +
  //   totalArchivedActivity;

  // Fungsi panggil data
  const fetchPics = usePics((state) => state.fetchPics);
  const fetchSummary = useSummary((state) => state.fetchSummary);

  // Ambil tasks ketika halaman dimuat
  useEffect(() => {
    const fetchAll = () => {
      fetchPics();
      fetchSummary();
    };
    fetchAll();
    const interval = setInterval(fetchAll, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between bg-nav h-[56px] px-5 py-3">
        <h1 className="text-3xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2 items-center">
          <Button>
            <Link to="/">Home</Link>
          </Button>
          {/* Filter PIC */}
          <Select value={selectedPicId} onValueChange={setSelectedPicId}>
            <SelectTrigger className="w-[160px] bg-neutral-100">
              <SelectValue placeholder="Pilih PIC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>PIC</SelectLabel>
                <SelectItem value="all">Semua PIC</SelectItem>
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
                  : 'Semua Hari'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                className="w-full"
                mode="range"
                locale={id}
                showWeekNumber
                captionLayout="dropdown"
                defaultMonth={range?.from}
                weekStartsOn={1}
                max={6}
                selected={range}
                onSelect={setRange}
                startMonth={new Date(2011, 12)}
                disabled={(date) =>
                  date > new Date() || date <= new Date('2011-12-31')
                }
              />
              <div className="p-3 flex gap-3 justify-between items-end border-t border-border">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() =>
                    setRange({
                      from: startOfDay(new Date()),
                      to: startOfDay(new Date()),
                    })
                  }
                >
                  Hari Ini
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setRange({ from: null, to: null })}
                >
                  Semua Hari
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {/* Akhir Tanggal */}
          <ModeToggle />
        </div>
      </header>
      {/* Main */}
      <main className="flex-1 grid gap-4 p-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-linear-to-t from-todo-500/60 to-card border-none">
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
        <Card className="bg-linear-to-t from-progress-500/60 to-card border-none">
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
          </CardFooter>
        </Card>
        <Card className="bg-linear-to-t from-done-500/60 to-card border-none">
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
        <Card className="bg-linear-to-t from-archived-500/60 to-card border-none">
          <CardHeader>
            <CardDescription>Total Archived Activty</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalArchivedActivity} Aktivitas
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
        {/* Chart */}
        <Card className="w-full max-h-[400px] md:col-span-2">
          <CardHeader>
            <CardTitle>Activity vs Work Time</CardTitle>
            <CardDescription>
              Perbandingan lama aktivitas dengan lama bekerja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="max-h-[300px] w-full"
            >
              <BarChart accessibilityLayer data={filteredSummary}>
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
                  dataKey="activity_duration"
                  fill="var(--color-activity_duration)"
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
          </CardContent>
        </Card>
        {/* Card */}
        {/* Table */}
        <div className="md:col-span-2">
          <DataTable columns={columns} data={placeholder}></DataTable>
        </div>
      </main>
      {/* Footer */}
      <footer className="flex items-center justify-center h-[39px] bg-nav py-2">
        <p className="text-white font-normal">
          &copy; {new Date().getFullYear()} Kanban App
        </p>
      </footer>
    </div>
  );
};

export default SummaryPage;
