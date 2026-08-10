import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import { RefreshToggle } from '@/components/shared/RefreshToggle';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ErrorBanner from '@/components/shared/ErrorBanner';
// import { Badge } from '@/components/ui/badge';
import { useFetchDashboard } from '@/features/dashboard/api/fetchDashboard';
import UserStatsCardSkeleton from '../features/dashboard/components/stats/UserStatsCardSkeleton';
import UserStatsCard from '../features/dashboard/components/stats/UserStatsCard';
import BarChartCard from '../features/dashboard/components/bar-chart/BarChartCard';
import DataTableCard from '../features/dashboard/components/data-table/DataTableCard';
import { useDashboardFilters } from '@/features/dashboard/hooks/useDashboardFilters';
// import PieChartCard from '../components/pie-chart/PieChartCard';

const DashboardPage = () => {
  const { dashboardFilters } = useDashboardFilters();

  const { data, error, isLoading, dataUpdatedAt } = useFetchDashboard({
    filters: dashboardFilters,
  });

  // const {
  //   data,
  //   error: fetchStatsError,
  //   isLoading,
  //   dataUpdatedAt,
  // } = useFetchStats(queryParams);

  // const { data: tableData, error: fetchTableDataError } =
  //   useFetchTableData(queryParams);

  // const { data: chartData, error: fetchChartDataError } =
  //   useFetchChartData(queryParams);

  // Ambil pesan error
  const errorMessage = error?.message;

  // Cek status online/offline
  const isOnline = useOnlineStatus();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Filter */}
      <div className="flex justify-between p-4 border-b">
        <div className="ml-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">{data?.division ?? '-'}</p>
        </div>
        <div className="flex gap-2 items-center">
          <RefreshToggle dataUpdatedAt={dataUpdatedAt} />
          {/* Filter Tanggal */}
          <FilterCalendar />
        </div>
      </div>
      {/* Main */}
      <main className="flex flex-col flex-1 gap-4 p-4">
        {(error || !isOnline) && <ErrorBanner errorMessage={errorMessage} />}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card
            size="sm"
            className="border-none bg-linear-150 from-card to-todo-accent/30"
          >
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Total To Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {data?.stats?.summary?.todo ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card
            size="sm"
            className="border-none bg-linear-150 from-card to-progress-accent/30"
          >
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Total On Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {data?.stats?.summary?.on_progress ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card
            size="sm"
            className="border-none bg-linear-150 from-card to-done-accent/30"
          >
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Total Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {data?.stats?.summary?.done ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card
            size="sm"
            className="border-none bg-linear-150 from-card to-total-accent/30"
          >
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Total Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {data?.stats?.summary?.total ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* User Stats */}
        <section className="my-6">
          <h3 className="mb-3 text-lg font-semibold tracking-tight">
            Statistik Per PIC
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <UserStatsCardSkeleton
                    key={i}
                    className="w-[calc((100%-4*16px)/5)]"
                  />
                ))
              : data?.stats?.users?.map((user) => (
                  <UserStatsCard
                    key={user.id}
                    user={user}
                    className="w-[calc((100%-4*16px)/5)]"
                  />
                ))}
          </div>
        </section>
        {/* Table */}
        <DataTableCard data={data?.table?.rows} />
        {/* Bar Chart */}
        <BarChartCard data={data?.chart} />
        {/* Pie Chart */}
        {/* <PieChartCard data={[]} /> */}
      </main>
    </div>
  );
};

export default DashboardPage;
