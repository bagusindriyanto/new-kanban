import { useEffect, useMemo, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import NavButton from '@/components/NavButton';
import StatusColumn from '@/components/StatusColumn';
import FormModal from '@/components/FormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ModeToggle } from '@/components/ModeToggle';
import useFormModal from '@/stores/formModalStore';
import { ChartNoAxesCombined } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  const { data: pics } = useFetchPics();
  // State untuk data
  // const pics = usePics((state) => state.pics);
  // const tasks = useTasks((state) => state.tasks);
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);
  // const sortedTasks = useMemo(() => {
  //   // Sorting
  //   let result = [...tasks].sort(
  //     (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  //   );
  //   // Filtering
  //   if (selectedPicId !== 'all') {
  //     result = result.filter((task) => task.pic_id === selectedPicId);
  //   }
  //   // Filtering Tanggal
  //   if (range?.from && range?.to) {
  //     result = result.filter((res) => {
  //       const date = startOfDay(parseISO(res.timestamp_todo));
  //       return date >= range.from && date <= range.to;
  //     });
  //   }
  //   return result;
  // }, [tasks, selectedPicId, range]);

  // State untuk modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  const setModalTitle = useFormModal((state) => state.setModalTitle);
  const setFormId = useFormModal((state) => state.setFormId);

  // Fungsi panggil data
  // const fetchActivities = useActivities((state) => state.fetchActivities);
  // const fetchPics = usePics((state) => state.fetchPics);
  // const fetchTasks = useTasks((state) => state.fetchTasks);

  // Ambil tasks ketika halaman dimuat
  // useEffect(() => {
  //   const fetchAll = () => {
  //     fetchActivities();
  //     fetchPics();
  //     fetchTasks();
  //   };
  //   fetchAll();
  //   const interval = setInterval(fetchAll, 20000);
  //   return () => clearInterval(interval);
  // }, []);

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
            <PopoverContent className="w-auto overflow-hidden p-0">
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
          <NavButton
            onClick={() => handleOpenModal('Tambah Activity', 'addActivity')}
          >
            Tambah Activity
          </NavButton>
          <NavButton onClick={() => handleOpenModal('Tambah PIC', 'addPic')}>
            Tambah PIC
          </NavButton>
          <NavButton onClick={() => handleOpenModal('Tambah Task', 'addTask')}>
            Tambah Task
          </NavButton>
          {/* Pindah ke Halaman Summary */}
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Link to="/summary">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="icon"
                >
                  <ChartNoAxesCombined />
                </Button>
              </Link>
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
      <main className="flex gap-4 p-4 flex-1">
        {columns.map((column) => (
          <StatusColumn
            key={column.id}
            title={column.title}
            tasks={tasks?.filter((task) => task.status === column.id)}
          />
        ))}
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
