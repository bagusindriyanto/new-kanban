import { useMemo } from 'react';
import {
  ListTodo,
  Clock4,
  Check,
  Archive,
  SquareKanban,
  Ban,
  UserRound,
  IdCardLanyard,
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
import PieChartCard from '@/components/PieChartCard';
import { Badge } from '@/components/ui/badge';

const SummaryPage = () => {
  // State
  const { data: pics, error: fetchPICsError } = useFetchPICs();

  // State Filter
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  const range = useFilter((state) => state.range);
  const selectedPic = pics?.find((pic) => pic.id === selectedPicId) ?? {
    full_name: '-',
    nik: null,
    alias: ' ',
  };

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
      <main className="flex-1 grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-6">
        {(fetchSummaryError || fetchPICsError || !isOnline) && (
          <ErrorBanner
            isOnline={isOnline}
            errorMessage={errorMessage}
            className="md:col-span-4 xl:col-span-6"
          />
        )}
        <Card className="xl:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardContent className="my-auto">
            {/* Content Section */}
            <div className="flex items-center gap-6">
              <div className="rounded-full size-24 flex justify-center items-center border border-border p-1 bg-accent text-muted-foreground shadow-md">
                <UserRound className="size-full" />
              </div>
              {/* Judul (Title Text) */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {selectedPic.full_name}
                </h2>
                {/* Badge ID (Tambahan Opsional) */}
                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <IdCardLanyard data-icon="inline-start" />
                  {selectedPic.nik ? `MGM ${selectedPic.nik}` : '-'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Total Aktivitas</CardDescription>
            {/* <div className="flex justify-between items-center"> */}
            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.summary.total_count} Aktivitas
            </CardTitle>
            {/* </div> */}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <Badge className="bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300">
                To Do: {data?.summary.todo_count}
              </Badge>
              <Badge className="bg-orange-300 text-orange-700 dark:bg-orange-700 dark:text-orange-300">
                On Progress: {data?.summary.on_progress_count}
              </Badge>
              <Badge className="bg-green-300 text-green-700 dark:bg-green-700 dark:text-green-300">
                Done: {data?.summary.done_count}
              </Badge>
              <Badge className="bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                Archived: {data?.summary.archived_count}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Operational Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {(data?.summary.percentage * 100).toFixed(2)}%
              </CardTitle>
              <div className="flex flex-col items-end gap-1.5 text-sm">
                <div className="font-medium">
                  Lama Aktivitas:{' '}
                  <span className="text-muted-foreground">
                    {data?.summary.total_activity_minutes ?? 0} menit
                  </span>
                </div>
                <div className="font-medium">
                  Lama Bekerja:{' '}
                  <span className="text-muted-foreground">
                    {data?.summary.total_working_minutes ?? 0} menit
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        {/* Table */}
        <Card className="md:col-span-2 xl:col-span-3 xl:row-span-2">
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
        {/* Chart */}
        <Card className="w-full md:col-span-2 xl:col-span-3">
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
        {/* Pie Chart */}
        <PieChartCard data={data?.table_summary} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SummaryPage;
