import { useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ListTodo,
  Clock4,
  Check,
  Archive,
  CalendarIcon,
  SquareKanban,
} from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  // State
  const pics = usePics((state) => state.pics);
  const summary = useSummary((state) => state.summary);
  const tableSummary = useSummary((state) => state.tableSummary);
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  const range = useFilter((state) => state.range);
  const setRange = useFilter((state) => state.setRange);

  // Urutkan dan filter task berdasarkan PIC
  const filteredSummary = useMemo(() => {
    // Filtering PIC
    let result = [...summary].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    if (selectedPicId !== 'all') {
      result = result.filter((res) => res.pic_id === selectedPicId);
    }
    // Filtering Tanggal
    if (range?.from && range?.to) {
      result = result.filter((res) => {
        if (!res.date) return false;
        const [year, month, day] = res.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date >= range.from && date <= range.to;
      });
    }
    // Total Activity, Activity Duration, Working Minute
    if (!range?.from && !range?.to) {
      result = Object.values(
        result.reduce(
          (
            acc,
            {
              date,
              todo_count,
              on_progress_count,
              done_count,
              archived_count,
              activity_duration,
              working_minute,
            }
          ) => {
            // const num = Number(value); // pastikan angka meskipun string
            if (!acc[date]) {
              acc[date] = {
                date,
                todo_count: 0,
                on_progress_count: 0,
                done_count: 0,
                archived_count: 0,
                activity_duration: 0,
                working_minute: 0,
              };
            }
            acc[date].todo_count += todo_count;
            acc[date].on_progress_count += on_progress_count;
            acc[date].done_count += done_count;
            acc[date].archived_count += archived_count;
            acc[date].activity_duration += activity_duration;
            acc[date].working_minute += working_minute;
            return acc;
          },
          {}
        )
      );
    }
    return result;
  }, [summary, selectedPicId, range]);

  const filteredTableSummary = useMemo(() => {
    let result = [...tableSummary];
    // Filtering PIC
    if (selectedPicId !== 'all') {
      result = result.filter((res) => res.pic_id === selectedPicId);
    }
    // Filtering Tanggal
    if (range?.from && range?.to) {
      result = result.filter((res) => {
        if (!res.date) return false;
        const [year, month, day] = res.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date >= range.from && date <= range.to;
      });
    }
    return result;
  }, [tableSummary, selectedPicId, range]);

  // Data pada Card
  const totalActivityMinutes = filteredSummary.reduce(
    (sum, res) => sum + res.activity_duration,
    0
  );
  const totalWorkingMinutes = filteredSummary.reduce(
    (sum, res) => sum + res.working_minute,
    0
  );
  const operationalTimePercentage = Number.isFinite(
    totalActivityMinutes / totalWorkingMinutes
  )
    ? (totalActivityMinutes / totalWorkingMinutes) * 100
    : 0;

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
  const totalActivity =
    totalTodoActivity +
    totalProgressActivity +
    totalDoneActivity +
    totalArchivedActivity;

  // Fungsi panggil data
  const fetchPics = usePics((state) => state.fetchPics);
  const fetchSummary = useSummary((state) => state.fetchSummary);
  const fetchTableSummary = useSummary((state) => state.fetchTableSummary);

  // Ambil tasks ketika halaman dimuat
  useEffect(() => {
    const fetchAll = () => {
      fetchPics();
      fetchSummary();
      fetchTableSummary();
    };
    fetchAll();
    const interval = setInterval(fetchAll, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 flex items-center justify-between bg-nav h-[56px] px-5 py-3">
        <h1 className="text-3xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2 items-center">
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
          {/* Pindah ke Halaman Kanban */}
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Link to="/">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="icon"
                >
                  <SquareKanban />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kanban Board</p>
            </TooltipContent>
          </Tooltip>
          <ModeToggle />
        </div>
      </header>
      {/* Main */}
      <main className="flex-1 grid gap-4 p-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalActivity} Aktivitas
            </CardTitle>
            {/* <CardAction>
              <Badge variant="outline">
                <TrendingDown />
                -20%
              </Badge>
            </CardAction> */}
          </CardHeader>
        </Card>
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Operational Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {operationalTimePercentage.toFixed(2)} %
              </CardTitle>
              <div className="flex flex-col items-end gap-1.5 text-sm">
                <div className="font-medium">
                  Lama Aktivitas:{' '}
                  <span className="text-muted-foreground">
                    {totalActivityMinutes} menit
                  </span>
                </div>
                <div className="font-medium">
                  Lama Bekerja:{' '}
                  <span className="text-muted-foreground">
                    {totalWorkingMinutes} menit
                  </span>
                </div>
              </div>
            </div>
            {/* <CardAction>
              <Badge variant="outline">
                <TrendingDown />
                -20%
              </Badge>
            </CardAction> */}
          </CardHeader>
        </Card>
        <Card className="bg-linear-to-t from-todo-500/60 to-card border-none">
          <CardHeader>
            <CardDescription>Total To Do Activities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalTodoActivity} Aktivitas
            </CardTitle>
            <CardAction>
              <ListTodo className="text-muted-foreground size-5" />
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-linear-to-t from-progress-500/60 to-card border-none">
          <CardHeader>
            <CardDescription>Total On Progress Activities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalProgressActivity} Aktivitas
            </CardTitle>
            <CardAction>
              <Clock4 className="text-muted-foreground size-5" />
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-linear-to-t from-done-500/60 to-card border-none">
          <CardHeader>
            <CardDescription>Total Done Activities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalDoneActivity} Aktivitas
            </CardTitle>
            <CardAction>
              <Check className="text-muted-foreground size-5" />
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="bg-linear-to-t from-archived-500/60 to-card border-none">
          <CardHeader>
            <CardDescription>Total Archived Activities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalArchivedActivity} Aktivitas
            </CardTitle>
            <CardAction>
              <Archive className="text-muted-foreground size-5" />
            </CardAction>
          </CardHeader>
        </Card>
        {/* Chart */}
        <Card className="w-full  md:col-span-2">
          <CardHeader>
            <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
            <CardDescription>
              Perbandingan lama aktivitas dengan lama bekerja.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-auto">
            <ChartContainer config={chartConfig} className="w-full max-h-96">
              <BarChart
                accessibilityLayer
                data={filteredSummary}
                margin={{ top: 18 }}
              >
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
                          <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-medium">
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
        <div className="w-full h-full md:col-span-2">
          <DataTable columns={columns} data={filteredTableSummary}></DataTable>
        </div>
      </main>
      {/* Footer */}
      <footer className="flex items-center justify-center h-[39px] bg-nav py-2">
        <p className="text-white text-sm font-normal">
          Made with &#10084; by Data Analyst &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default SummaryPage;
