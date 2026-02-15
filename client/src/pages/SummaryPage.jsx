import { useMemo } from 'react';
import {
  ListTodo,
  Clock4,
  Check,
  Archive,
  SquareKanban,
  Ban,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  LabelList,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from 'recharts';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
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
import { FilterCalendar } from '@/components/FilterCalendar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link } from 'react-router';
import { chartConfig } from '@/config/chartConfig';
import useFilter from '@/stores/filterStore';
import ModeToggle from '@/components/ModeToggle';
// Data Table
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/columns';
import { useFetchPICs } from '@/api/fetchPICs';
import { useFetchSummary } from '@/api/fetchSummary';
import { RefreshToggle } from '@/components/RefreshToggle';
import Footer from '@/components/Footer';
import { useIsOnline } from '@/hooks/useIsOnline';
import { format } from 'date-fns';
import ErrorBanner from '@/components/ErrorState';
import usePieChartData from '@/hooks/usePieChartData';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const SummaryPage = () => {
  // State
  const { data: pics, error: fetchPICsError } = useFetchPICs();
  // const {
  //   data: summary,
  //   error: fetchSummaryError,
  //   isFetching,
  //   dataUpdatedAt,
  // } = useFetchSummary();
  // const { data: tableSummary, error: fetchTableSummaryError } =
  //   useFetchTableSummary();

  // State Filter
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  const range = useFilter((state) => state.range);

  // Buat filter object untuk API
  const filters = useMemo(
    () => ({
      pic_id: selectedPicId !== 'all' ? selectedPicId : undefined,
      from_date: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      to_date: range.to ? format(range.to, 'yyyy-MM-dd') : undefined,
    }),
    [selectedPicId, range],
  );

  const {
    data,
    error: fetchSummaryError,
    isFetching,
    dataUpdatedAt,
  } = useFetchSummary(filters);

  // Ambil pesan error
  const errorMessage =
    fetchSummaryError?.response?.data?.message ||
    fetchPICsError?.response?.data?.message ||
    null;

  // Cek status online/offline
  const isOnline = useIsOnline();

  // Pie Chart Data
  const { chartData: pieChartData, chartConfig: pieChartConfig } =
    usePieChartData(data?.table_summary || []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-nav h-[52px] px-5 py-3">
        <h1 className="text-3xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2 items-center">
          {/* Refresh Data */}
          <RefreshToggle
            isFetching={isFetching}
            dataUpdatedAt={dataUpdatedAt}
          />
          {/* Filter PIC */}
          <Select value={selectedPicId} onValueChange={setSelectedPicId}>
            <SelectTrigger className="w-[150px] bg-white" size="sm">
              <SelectValue placeholder="Pilih PIC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>PIC</SelectLabel>
                <SelectItem className="hidden" value="all" disabled>
                  Pilih PIC
                </SelectItem>
                {pics?.map((pic) => (
                  <SelectItem value={pic.id} key={pic.id}>
                    {pic.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Akhir Filter PIC */}
          {/* Filter Tanggal */}
          <FilterCalendar />
          {/* Akhir Tanggal */}
          {/* Pindah ke Halaman Kanban */}
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon-sm">
                <Link to="/">
                  <SquareKanban />
                </Link>
              </Button>
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
        {(fetchSummaryError || fetchPICsError || !isOnline) && (
          <ErrorBanner
            isOnline={isOnline}
            errorMessage={errorMessage}
            className="md:col-span-2 xl:col-span-4"
          />
        )}
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.summary.total_count} Aktivitas
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Operational Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data?.summary.percentage.toFixed(2)}
              </CardTitle>
              <div className="flex flex-col items-end gap-1.5 text-sm">
                <div className="font-medium">
                  Lama Aktivitas:{' '}
                  <span className="text-muted-foreground">
                    {data?.summary.total_activity_minutes} menit
                  </span>
                </div>
                <div className="font-medium">
                  Lama Bekerja:{' '}
                  <span className="text-muted-foreground">
                    {data?.summary.total_working_minutes} menit
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-linear-to-t from-todo-500/60 to-card border-none">
          <CardHeader>
            <CardDescription>Total To Do Activities</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.summary.todo_count} Aktivitas
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
              {data?.summary.on_progress_count} Aktivitas
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
              {data?.summary.done_count} Aktivitas
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
              {data?.summary.archived_count} Aktivitas
            </CardTitle>
            <CardAction>
              <Archive className="text-muted-foreground size-5" />
            </CardAction>
          </CardHeader>
        </Card>
        {/* Chart */}
        <Card className="w-full md:col-span-2">
          <CardHeader>
            <CardTitle>Lama Aktivitas vs Lama Bekerja</CardTitle>
            <CardDescription>
              Perbandingan lama aktivitas dengan lama bekerja.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-auto">
            <ChartContainer config={chartConfig} className="w-full max-h-96">
              <BarChart accessibilityLayer data={[]} margin={{ top: 18 }}>
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tabel Aktivitas</CardTitle>
            <CardDescription>
              Menampilkan jenis aktivitas, total durasi, jumlah aktivitas, serta
              rata-rata durasi setiap aktivitas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data?.table_summary || []}
            ></DataTable>
          </CardContent>
        </Card>
        {/* Pie Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Proporsi Aktivitas</CardTitle>
            <CardDescription>
              Menampilkan proporsi setiap aktivitas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {pieChartData.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Ban />
                  </EmptyMedia>
                  <EmptyTitle>Tidak Ada Aktivitas</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <ChartContainer
                config={pieChartConfig}
                className="[&_.recharts-pie-label-text]:fill-foreground mx-auto max-h-96"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => (
                          <>
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                              style={{
                                '--color-bg': `var(--color-${name})`,
                              }}
                            />
                            {pieChartConfig[name]?.label || name}
                            <div className="text-foreground ml-auto flex items-baseline gap-1 font-medium tabular-nums">
                              {value}
                              <span className="text-muted-foreground font-normal">
                                menit
                              </span>
                            </div>
                          </>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="total_minutes"
                    nameKey="content"
                    label={({ percent }) => {
                      return `${(percent * 100).toFixed(1)}%`;
                    }}
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent
                        nameKey="content"
                        className="translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SummaryPage;
