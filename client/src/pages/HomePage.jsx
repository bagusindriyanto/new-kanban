import { useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import StatusColumn from '@/components/StatusColumn';
import UpdateTaskModal from '@/components/UpdateTaskModal';
import DeleteTaskModal from '@/components/DeleteTaskModal';
import ModeToggle from '@/components/ModeToggle';
import {
  ChartNoAxesCombined,
  ClipboardCheck,
  WifiOff,
  ServerOff,
  RotateCw,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Link } from 'react-router';

// Setting Kolom
import { columns } from '@/config/column';

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
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import useFilter from '@/stores/filterStore';
// Format Tanggal
import { FilterCalendar } from '@/components/FilterCalendar';
import { startOfDay, parseISO } from 'date-fns';
import { useFetchTasks } from '@/api/fetchTasks';
import { useFetchPICs } from '@/api/fetchPICs';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { RefreshToggle } from '@/components/RefreshToggle';
import Footer from '@/components/Footer';
import { useIsOnline } from '@/hooks/useIsOnline';
import AddActivityModal from '@/components/AddActivityModal';
import AddPICModal from '@/components/AddPICModal';
import AddTaskModal from '@/components/AddTaskModal';

const HomePage = () => {
  // State untuk filter tanggal
  const range = useFilter((state) => state.range);

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading: isFetchTasksLoading,
    error: fetchTasksError,
    isFetching,
    dataUpdatedAt,
  } = useFetchTasks();
  // Tanstack query untuk pics
  const {
    data: pics,
    isLoading: isFetchPICsLoading,
    error: fetchPICsError,
  } = useFetchPICs();
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  const sortedTasks = useMemo(() => {
    // Check data tasks ada atau tidak
    if (!tasks) return [];
    return tasks
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .filter((task) => {
        // 1. Filter berdasarkan PIC
        const matchedPic =
          selectedPicId === 'all' || task.pic_id === selectedPicId;
        // 2. Filter berdasarkan tanggal
        let matchedDate;
        if (task.status === 'todo' || task.status === 'on progress') {
          matchedDate = true;
        } else {
          const taskDate =
            startOfDay(parseISO(task.timestamp_done)) ??
            startOfDay(new Date(null));
          const fromDate = range.from;
          const toDate = range.to;
          matchedDate =
            (!fromDate || taskDate >= fromDate) &&
            (!toDate || taskDate <= toDate);
        }
        return matchedPic && matchedDate;
      });
  }, [tasks, selectedPicId, range]);

  // Error log
  if (fetchTasksError) {
    console.log('Error Fetch Tasks:');
    console.error(
      fetchTasksError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.',
    );
  }
  if (fetchPICsError) {
    console.log('Error Fetch PIC:');
    console.error(
      fetchPICsError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.',
    );
  }

  // Cek status online/offline
  const isOnline = useIsOnline();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-nav h-[52px] px-5 py-3">
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
                <SelectItem value="all">Semua PIC</SelectItem>
                <SelectItem value={null}>-</SelectItem>
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
          <AddActivityModal />
          <AddPICModal />
          <AddTaskModal buttonVariant="nav" buttonSize="sm" />
          {/* Pindah ke Halaman Summary */}
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon-sm">
                <Link to="/summary">
                  <ChartNoAxesCombined />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ringkasan</p>
            </TooltipContent>
          </Tooltip>
          {/* Toggle Dark Mode */}
          <ModeToggle />
        </div>
      </header>
      {/* Main */}
      <main className="flex flex-1 flex-col p-3 gap-3">
        {isOnline &&
          (isFetchTasksLoading || isFetchPICsLoading) &&
          !fetchTasksError &&
          !fetchPICsError && (
            <div className="flex flex-1 justify-center items-center">
              <Spinner className="size-10" />
            </div>
          )}
        {sortedTasks.length > 0 &&
          (fetchTasksError || fetchPICsError || !isOnline) && (
            <Item className="bg-destructive/15" variant="muted">
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
                    : fetchTasksError?.response?.data?.message ||
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
        {sortedTasks.length === 0 &&
          (fetchTasksError || fetchPICsError || !isOnline) && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {!isOnline ? (
                    <WifiOff className="text-destructive" />
                  ) : (
                    <ServerOff className="text-destructive" />
                  )}
                </EmptyMedia>
                <EmptyTitle className="text-destructive">
                  {!isOnline ? 'Kamu Sedang Offline' : 'Terjadi Kesalahan'}
                </EmptyTitle>
                <EmptyDescription className="text-destructive/90">
                  {!isOnline
                    ? 'Mohon periksa koneksi internetmu.'
                    : fetchTasksError?.response?.data?.message ||
                      fetchPICsError?.response?.data?.message ||
                      'Gagal terhubung ke server.'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => window.location.reload(false)}
                  variant="outline"
                >
                  <RotateCw />
                  Refresh Halaman
                </Button>
              </EmptyContent>
            </Empty>
          )}
        {sortedTasks.length === 0 &&
          !isFetchTasksLoading &&
          !fetchTasksError &&
          isOnline && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ClipboardCheck />
                </EmptyMedia>
                <EmptyTitle>Tidak Ada Task</EmptyTitle>
                <EmptyDescription>
                  Kamu belum menambahkan task. Klik tombol di bawah ini untuk
                  mulai membuat daftar aktivitasmu.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <AddTaskModal />
              </EmptyContent>
            </Empty>
          )}
        {sortedTasks.length > 0 && (
          <div className="flex gap-4 flex-1">
            {columns.map((column) => (
              <StatusColumn
                key={column.id}
                title={column.title}
                tasks={sortedTasks.filter((task) => task.status === column.id)}
              />
            ))}
          </div>
        )}
      </main>
      {/* Footer */}
      <Footer />
      {/* Modal untuk update task */}
      <UpdateTaskModal />
      {/* Modal untuk hapus task */}
      <DeleteTaskModal />
      {/* Toast */}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default HomePage;
