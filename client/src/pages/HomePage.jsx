import { useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import StatusColumn from '@/components/StatusColumn';
import FormModal from '@/components/FormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ModeToggle } from '@/components/ModeToggle';
import useFormModal from '@/stores/formModalStore';
import { ChartNoAxesCombined, ClipboardCheck, WifiOff } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
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

const HomePage = () => {
  // State untuk filter tanggal
  const range = useFilter((state) => state.range);
  const setRange = useFilter((state) => state.setRange);

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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-nav h-[56px] px-5 py-3">
        <h1 className="text-3xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2 items-center">
          {/* Filter PIC */}
          <Select value={picId} onValueChange={setPicId}>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon />
                {range.from && range.to
                  ? `${range.from.toLocaleDateString(
                      'id'
                    )} - ${range.to.toLocaleDateString('id')}`
                  : 'Semua Hari'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0">
              <Calendar
                className="w-full"
                mode="range"
                locale={id}
                showWeekNumber
                captionLayout="dropdown"
                defaultMonth={range.from}
                weekStartsOn={1}
                // max={6}
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
          <Button
            onClick={() => handleOpenModal('Tambah Activity', 'addActivity')}
            variant="nav"
          >
            Tambah Activity
          </Button>
          <Button
            onClick={() => handleOpenModal('Tambah PIC', 'addPic')}
            variant="nav"
          >
            Tambah PIC
          </Button>
          <Button
            onClick={() => handleOpenModal('Tambah Task', 'addTask')}
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
        {(fetchTasksLoading || fetchPicsLoading) && (
          <div className="flex flex-1 justify-center items-center">
            <Spinner className="size-10" />
          </div>
        )}
        {sortedTasks.length > 0 && (fetchTasksError || fetchPicsError) && (
          <Item variant="muted">
            <ItemMedia variant="icon">
              <WifiOff className="text-destructive" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-destructive">
                Tidak Ada Koneksi
              </ItemTitle>
              <ItemDescription className="text-destructive/90">
                {fetchTasksError.message || fetchPicsError.message}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                onClick={() => window.location.reload(false)}
                size="sm"
                variant="outline"
              >
                Refresh Halaman
              </Button>
            </ItemActions>
          </Item>
        )}
        {sortedTasks.length === 0 && (fetchTasksError || fetchPicsError) && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WifiOff className="text-destructive" />
              </EmptyMedia>
              <EmptyTitle className="text-destructive">
                Tidak Ada Koneksi
              </EmptyTitle>
              <EmptyDescription className="text-destructive/90">
                {fetchTasksError.message || fetchPicsError.message}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={() => window.location.reload(false)}
                variant="outline"
              >
                Refresh Halaman
              </Button>
            </EmptyContent>
          </Empty>
        )}
        {sortedTasks.length === 0 && !fetchTasksLoading && !fetchTasksError && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardCheck />
              </EmptyMedia>
              <EmptyTitle>Tidak Ada Task</EmptyTitle>
              <EmptyDescription>
                Kamu belum menambahkan task. Klik tombol di bawah ini untuk
                mulai membuat daftar kegiatanmu.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => handleOpenModal('Tambah Task', 'addTask')}>
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
