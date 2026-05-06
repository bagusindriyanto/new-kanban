import UserStatsCard from '@/components/dashboard/UserStatsCard';
import UserStatsCardSkeleton from '@/components/dashboard/UserStatsCardSkeleton';
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
// Data Table
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/columns';
import { useFetchSummary } from '@/api/fetchSummary';
import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { useIsOnline } from '@/hooks/useIsOnline';
import { ErrorBanner } from '@/components/shared/ErrorState';
import PieChartCard from '@/components/dashboard/PieChartCard';
import { Badge } from '@/components/ui/badge';
import BarChartCard from '@/components/dashboard/BarChartCard';
import SiteHeader from '@/components/layout/SiteHeader';
import useFilter from '@/stores/filterStore';
import { format } from 'date-fns';
import { useFetchTableSummary } from '@/api/fetchTableSummary';

const SummaryPage = () => {
  const range = useFilter((state) => state.range);

  const queryParams = {
    from_date: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
    to_date: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
  };

  const {
    data,
    error: fetchSummaryError,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useFetchSummary(queryParams);

  const { data: tableData, error: fetchTableSummaryError } =
    useFetchTableSummary(queryParams);

  // Ambil pesan error
  const errorMessage =
    fetchSummaryError?.response?.data?.message ||
    fetchTableSummaryError?.response?.data?.message ||
    null;

  // Cek status online/offline
  const isOnline = useIsOnline();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader titlePage="Performance" />
      {/* Filter */}
      <div className="flex justify-between px-4 pt-4">
        <div className="ml-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">{data?.division ?? '-'}</p>
        </div>
        <div className="flex gap-2 items-center">
          <RefreshToggle
            isFetching={isFetching}
            dataUpdatedAt={dataUpdatedAt}
          />
          {/* Filter Tanggal */}
          <FilterCalendar />
        </div>
      </div>
      {/* Main */}
      <main className="grid flex-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-6">
        {(fetchSummaryError || !isOnline) && (
          <ErrorBanner
            isOnline={isOnline}
            errorMessage={errorMessage}
            className="md:col-span-4 xl:col-span-6"
          />
        )}
        <Card className="border-none xl:col-span-3 bg-linear-to-t from-primary/10 to-card">
          <CardHeader>
            <CardDescription>Total Aktivitas</CardDescription>
            {/* <div className="flex justify-between items-center"> */}
            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.summary?.total_tasks ?? 0} Aktivitas
            </CardTitle>
            {/* </div> */}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <Badge className="border text-todo-foreground bg-todo border-todo-border">
                To Do: {data?.summary?.todo ?? 0}
              </Badge>
              <Badge className="border text-progress-foreground bg-progress border-progress-border">
                On Progress: {data?.summary?.on_progress ?? 0}
              </Badge>
              <Badge className="border text-done-foreground bg-done border-done-border">
                Done: {data?.summary?.done ?? 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none xl:col-span-3 bg-linear-to-t from-primary/10 to-card">
          <CardHeader>
            <CardDescription>Operational Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {100}%
              </CardTitle>
              <div className="flex flex-col items-end gap-1.5 text-sm">
                <div className="font-medium">
                  Lama Aktivitas:{' '}
                  <span className="text-muted-foreground">{0} menit</span>
                </div>
                <div className="font-medium">
                  Lama Bekerja:{' '}
                  <span className="text-muted-foreground">{0} menit</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        {/* User Stats */}
        <section className="md:col-span-2 xl:col-span-6">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Statistik Per Anggota
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <UserStatsCardSkeleton
                    key={i}
                    className="flex-1 min-w-[200px] max-w-[280px]"
                  />
                ))
              : data?.users?.map((user) => (
                  <UserStatsCard
                    key={user.full_name}
                    user={user}
                    className="flex-1 min-w-[200px] max-w-[280px]"
                  />
                ))}
          </div>
        </section>
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
            <DataTable columns={columns} data={tableData?.rows || []} />
          </CardContent>
        </Card>
        {/* Bar Chart */}
        <BarChartCard data={[]} />
        {/* Pie Chart */}
        <PieChartCard data={[]} />
      </main>
    </div>
  );
};

export default SummaryPage;
