import { UserRound, IdCardLanyard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
// Data Table
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/columns';
import { useFetchPics } from '@/api/fetchPics';
import { useFetchSummary } from '@/api/fetchSummary';
import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { useIsOnline } from '@/hooks/useIsOnline';
import { ErrorBanner } from '@/components/shared/ErrorState';
import PieChartCard from '@/components/dashboard/PieChartCard';
import { Badge } from '@/components/ui/badge';
import BarChartCard from '@/components/dashboard/BarChartCard';
import useTaskFilters from '@/hooks/useTaskFilters';
import SiteHeader from '@/components/layout/SiteHeader';
import { cn } from '@/lib/utils';

const SummaryPage = () => {
  // State
  const { data: pics, error: fetchPicsError } = useFetchPics();

  // Gunakan custom hook untuk logic filter
  const { selectedPicId, setSelectedPicId, queryParams } = useTaskFilters();

  const picsItems = [
    { label: 'Pilih PIC', value: 'all' },
    ...(pics?.map((pic) => ({
      label: pic.name,
      value: pic.id,
    })) || []),
  ];

  const selectedPic = pics?.find((pic) => pic.id === selectedPicId) ?? {
    full_name: '-',
    nik: null,
    alias: ' ',
  };

  const {
    data,
    error: fetchSummaryError,
    isFetching,
    dataUpdatedAt,
  } = useFetchSummary(queryParams);

  // Ambil pesan error
  const errorMessage =
    fetchSummaryError?.response?.data?.message ||
    fetchPicsError?.response?.data?.message ||
    null;

  // Cek status online/offline
  const isOnline = useIsOnline();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader titlePage="Ringkasan" />
      {/* Filter */}
      <div className="flex justify-between px-4 pt-4">
        <h2 className="ml-1 text-2xl font-bold tracking-tight">Ringkasan</h2>
        <div className="flex gap-2 items-center">
          <RefreshToggle
            isFetching={isFetching}
            dataUpdatedAt={dataUpdatedAt}
          />
          {/* Filter PIC */}
          <Select
            items={picsItems}
            value={selectedPicId}
            onValueChange={setSelectedPicId}
          >
            <SelectTrigger className="w-[150px]" size="sm">
              <SelectValue placeholder="Pilih PIC" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectLabel>PIC</SelectLabel>
                {picsItems.map((item) => (
                  <SelectItem
                    key={String(item.value)}
                    value={item.value}
                    className={cn(item.value === 'all' && 'hidden')}
                    disabled={item.value === 'all'}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Filter Tanggal */}
          <FilterCalendar />
        </div>
      </div>
      {/* Main */}
      <main className="grid flex-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-6">
        {(fetchSummaryError || fetchPicsError || !isOnline) && (
          <ErrorBanner
            isOnline={isOnline}
            errorMessage={errorMessage}
            className="md:col-span-4 xl:col-span-6"
          />
        )}
        <Card className="border-none xl:col-span-2 bg-linear-to-t from-primary/10 to-card">
          <CardContent className="my-auto">
            {/* Content Section */}
            <div className="flex gap-6 items-center">
              <div className="flex justify-center items-center p-1 rounded-full border shadow-md size-24 shrink-0 border-border text-muted-foreground">
                <UserRound className="size-full" />
              </div>
              {/* Judul (Title Text) */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {selectedPic.full_name}
                </h2>
                {/* Badge ID (Tambahan Opsional) */}
                <Badge className="text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300">
                  <IdCardLanyard data-icon="inline-start" />
                  {selectedPic.nik ? `MGM ${selectedPic.nik}` : '-'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none xl:col-span-2 bg-linear-to-t from-primary/10 to-card">
          <CardHeader>
            <CardDescription>Total Aktivitas</CardDescription>
            {/* <div className="flex justify-between items-center"> */}
            <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.summary?.total_count ?? 0} Aktivitas
            </CardTitle>
            {/* </div> */}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              <Badge className="border text-todo-foreground bg-todo border-todo-border">
                To Do: {data?.summary?.todo_count ?? 0}
              </Badge>
              <Badge className="border text-progress-foreground bg-progress border-progress-border">
                On Progress: {data?.summary?.on_progress_count ?? 0}
              </Badge>
              <Badge className="border text-done-foreground bg-done border-done-border">
                Done: {data?.summary?.done_count ?? 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none md:col-span-2 bg-linear-to-t from-primary/10 to-card">
          <CardHeader>
            <CardDescription>Operational Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-4xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {((data?.summary?.percentage ?? 0) * 100).toFixed(2)}%
              </CardTitle>
              <div className="flex flex-col items-end gap-1.5 text-sm">
                <div className="font-medium">
                  Lama Aktivitas:{' '}
                  <span className="text-muted-foreground">
                    {data?.summary?.total_activity_minutes ?? 0} menit
                  </span>
                </div>
                <div className="font-medium">
                  Lama Bekerja:{' '}
                  <span className="text-muted-foreground">
                    {data?.summary?.total_working_minutes ?? 0} menit
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
        {/* Bar Chart */}
        <BarChartCard data={data?.chart_summary} />
        {/* Pie Chart */}
        <PieChartCard data={data?.table_summary} />
      </main>
    </div>
  );
};

export default SummaryPage;
