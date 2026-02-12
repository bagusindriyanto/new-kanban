import { useMemo } from 'react';
import {
  ListTodo,
  Clock4,
  Check,
  Archive,
  SquareKanban,
  WifiOff,
  ServerOff,
  RotateCw,
} from 'lucide-react';
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
import { useFetchTableSummary } from '@/api/fetchTableSummary';
// Status
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { RefreshToggle } from '@/components/RefreshToggle';
import Footer from '@/components/Footer';
import { useIsOnline } from '@/hooks/useIsOnline';

const SummaryPage = () => {
  // State
  const { data: pics, error: fetchPICsError } = useFetchPICs();
  const {
    data: summary,
    error: fetchSummaryError,
    isFetching,
    dataUpdatedAt,
  } = useFetchSummary();
  const { data: tableSummary, error: fetchTableSummaryError } =
    useFetchTableSummary();

  // State Filter
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  const range = useFilter((state) => state.range);

  // Urutkan dan filter task berdasarkan PIC
  const filteredSummary = useMemo(() => {
    if (!summary || selectedPicId === 'all') return [];
    return summary
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((row) => {
        const matchedPic = row.pic_id === selectedPicId;
        const [year, month, day] = row.date.split('-').map(Number);
        const rowDate = new Date(year, month - 1, day);
        const fromDate = range.from;
        const toDate = range.to;
        const matchedDate =
          (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);
        return matchedPic && matchedDate;
      });
  }, [summary, selectedPicId, range]);

  const stats = useMemo(() => {
    if (!summary || selectedPicId === 'all')
      return {
        totalTodo: 0,
        totalProgress: 0,
        totalDone: 0,
        totalArchived: 0,
        totalActivities: 0,
        totalActivityMinutes: 0,
        totalWorkingMinutes: 0,
        operationalTimePercentage: 0,
      };
    let result;
    result = summary
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((row) => row.pic_id === selectedPicId);

    const totalTodo = result[0]?.todo_count ?? 0;

    result = result.filter((row) => {
      const [year, month, day] = row.date.split('-').map(Number);
      const rowDate = new Date(year, month - 1, day);
      const fromDate = range.from;
      const toDate = range.to;
      const matchedDate =
        (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);
      return matchedDate;
    });

    let totalProgress = 0;
    let totalDone = 0;
    let totalArchived = 0;
    let totalActivityMinutes = 0;
    let totalWorkingMinutes = 0;

    const comboList = new Set();
    for (const row of result) {
      const key = `${row.date}`;
      if (!comboList.has(key)) {
        comboList.add(key);
        totalProgress += row.on_progress_count;
        totalDone += row.done_count;
        totalArchived += row.archived_count;
        totalActivityMinutes += row.activity_duration;
        totalWorkingMinutes += row.working_minute;
      }
    }

    const totalActivities =
      totalTodo + totalProgress + totalDone + totalArchived;
    const operationalTimePercentage = Number.isFinite(
      totalActivityMinutes / totalWorkingMinutes,
    )
      ? (totalActivityMinutes / totalWorkingMinutes) * 100
      : 0;

    return {
      totalTodo,
      totalProgress,
      totalDone,
      totalArchived,
      totalActivities,
      totalActivityMinutes,
      totalWorkingMinutes,
      operationalTimePercentage,
    };
  }, [summary, selectedPicId, range]);

  const filteredTableSummary = useMemo(() => {
    if (!tableSummary || selectedPicId === 'all') return [];
    return tableSummary.filter((row) => {
      const matchedPic = row.pic_id === selectedPicId;
      let matchedDate;
      if (!row.date) {
        matchedDate = false;
      } else {
        const [year, month, day] = row.date.split('-').map(Number);
        const rowDate = new Date(year, month - 1, day);
        const fromDate = range.from;
        const toDate = range.to;
        matchedDate =
          (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);
      }
      return matchedPic && matchedDate;
    });
  }, [tableSummary, selectedPicId, range]);

  // Cek status online/offline
  const isOnline = useIsOnline();

  return (
    <div className="h-screen flex flex-col">
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
        {(fetchSummaryError ||
          fetchTableSummaryError ||
          fetchPICsError ||
          !isOnline) && (
          <Item
            className="md:col-span-2 xl:col-span-4 bg-destructive/15"
            variant="muted"
          >
            <ItemMedia variant="icon">
              {!isOnline ? (
                <WifiOff className="text-destructive" />
              ) : (
                <ServerOff className="text-destructive" />
              )}
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-destructive">
                {!isOnline ? 'Kamu Sedang Offline' : 'Terjadi Kesalahan'}
              </ItemTitle>
              <ItemDescription className="text-destructive/90">
                {!isOnline
                  ? 'Mohon periksa koneksi internetmu.'
                  : fetchSummaryError?.response?.data?.message ||
                    fetchTableSummaryError?.response?.data?.message ||
                    fetchPICsError?.response?.data?.message ||
                    'Gagal terhubung ke server.'}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                onClick={() => window.location.reload(false)}
                size="sm"
                variant="outline"
              >
                <RotateCw />
                Refresh Halaman
              </Button>
            </ItemActions>
          </Item>
        )}
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.totalActivities} Aktivitas
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="md:col-span-2 bg-linear-to-t from-primary/10 to-card border-none">
          <CardHeader>
            <CardDescription>Operational Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.operationalTimePercentage.toFixed(2)} %
              </CardTitle>
              <div className="flex flex-col items-end gap-1.5 text-sm">
                <div className="font-medium">
                  Lama Aktivitas:{' '}
                  <span className="text-muted-foreground">
                    {stats.totalActivityMinutes} menit
                  </span>
                </div>
                <div className="font-medium">
                  Lama Bekerja:{' '}
                  <span className="text-muted-foreground">
                    {stats.totalWorkingMinutes} menit
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
              {stats.totalTodo} Aktivitas
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
              {stats.totalProgress} Aktivitas
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
              {stats.totalDone} Aktivitas
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
              {stats.totalArchived} Aktivitas
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
              data={filteredTableSummary}
            ></DataTable>
          </CardContent>
        </Card>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SummaryPage;
