import { useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import StatusColumn from '@/components/StatusColumn';
import FormModal from '@/components/FormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ModeToggle } from '@/components/ModeToggle';
import useFormModal from '@/stores/formModalStore';
import {
  ChartNoAxesCombined,
  ClipboardCheck,
  WifiOff,
  ServerOff,
  RefreshCw,
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
import { useFetchPics } from '@/api/fetchPics';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useState, useEffect } from 'react';

const HomePage = () => {
  // State untuk filter tanggal
  const range = useFilter((state) => state.range);

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading: fetchTasksLoading,
    error: fetchTasksError,
  } = useFetchTasks();
  // Tanstack query untuk pics
  const {
    data: pics,
    isLoading: fetchPicsLoading,
    error: fetchPicsError,
  } = useFetchPics();
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
        if (task.status === 'todo') {
          matchedDate = true;
        } else {
          const taskDate =
            startOfDay(parseISO(task.timestamp_progress)) ??
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

  // State untuk modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  const setModalTitle = useFormModal((state) => state.setModalTitle);
  const setFormId = useFormModal((state) => state.setFormId);

  const handleOpenModal = (title, id) => {
    // Buka modalnya
    setIsModalOpen(true);
    // Set tipe modalnya
    setModalTitle(title);
    // Set id formnya
    setFormId(id);
  };

  // Error log
  if (fetchTasksError) {
    console.log('Error Fetch Tasks:');
    console.error(
      fetchTasksError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.'
    );
  }
  if (fetchPicsError) {
    console.log('Error Fetch PIC:');
    console.error(
      fetchPicsError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.'
    );
  }

  // Cek status online/offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-nav h-[56px] px-5 py-3">
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
          <Button
            onClick={() => handleOpenModal('Tambah Activity', 'add-activity')}
            variant="nav"
          >
            Tambah Activity
          </Button>
          <Button
            onClick={() => handleOpenModal('Tambah PIC', 'add-pic')}
            variant="nav"
          >
            Tambah PIC
          </Button>
          <Button
            onClick={() => handleOpenModal('Tambah Task', 'add-task')}
            variant="nav"
          >
            Tambah Task
          </Button>
          {/* Pindah ke Halaman Summary */}
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
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
      <main className="flex flex-1 flex-col p-4 gap-4">
        {isOnline &&
          (fetchTasksLoading || fetchPicsLoading) &&
          !fetchTasksError &&
          !fetchPicsError && (
            <div className="flex flex-1 justify-center items-center">
              <Spinner className="size-10" />
            </div>
          )}
        {sortedTasks.length > 0 &&
          (fetchTasksError || fetchPicsError || !isOnline) && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                {!isOnline ? (
                  <WifiOff className="text-destructive" />
                ) : (
                  <ServerOff className="text-destructive" />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-destructive">
                  {!isOnline ? 'Kamu Sedang Offine' : 'Terjadi Kesalahan'}
                </ItemTitle>
                <ItemDescription className="text-destructive/90">
                  {!isOnline
                    ? 'Mohon periksa koneksi internetmu.'
                    : fetchTasksError?.response?.data?.message ||
                      fetchPicsError?.response?.data?.message ||
                      'Gagal terhubung ke server.'}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  onClick={() => window.location.reload(false)}
                  size="sm"
                  variant="outline"
                >
                  <RefreshCw />
                  Refresh Halaman
                </Button>
              </ItemActions>
            </Item>
          )}
        {sortedTasks.length === 0 &&
          (fetchTasksError || fetchPicsError || !isOnline) && (
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
                  {!isOnline ? 'Kamu Sedang Offine' : 'Terjadi Kesalahan'}
                </EmptyTitle>
                <EmptyDescription className="text-destructive/90">
                  {!isOnline
                    ? 'Mohon periksa koneksi internetmu.'
                    : fetchTasksError?.response?.data?.message ||
                      fetchPicsError?.response?.data?.message ||
                      'Gagal terhubung ke server.'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => window.location.reload(false)}
                  variant="outline"
                >
                  <RefreshCw />
                  Refresh Halaman
                </Button>
              </EmptyContent>
            </Empty>
          )}
        {sortedTasks.length === 0 &&
          !fetchTasksLoading &&
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
                <Button
                  onClick={() => handleOpenModal('Tambah Task', 'add-task')}
                >
                  Tambah Task
                </Button>
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
      <footer className="flex items-center justify-center h-[39px] bg-nav py-2">
        <p className="text-white text-sm font-normal">
          Made with &#10084; by Data Analyst &copy; {new Date().getFullYear()}
        </p>
      </footer>
      {/* Form Modal */}
      <FormModal />
      {/* Confirm Modal */}
      <ConfirmModal />
      {/* Toast */}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default HomePage;
