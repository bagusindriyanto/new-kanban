import { useEffect, useMemo, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import NavButton from '@/components/NavButton';
import StatusColumn from '@/components/StatusColumn';
import FormModal from '@/components/FormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { ModeToggle } from '@/components/ModeToggle';
import useActivities from '@/stores/activityStore';
import usePics from '@/stores/picStore';
import useTasks from '@/stores/taskStore';
import useFormModal from '@/stores/formModalStore';
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

const HomePage = () => {
  // State untuk data
  const pics = usePics((state) => state.pics);
  const [selectedPicId, setSelectedPicId] = useState('all');
  const tasks = useTasks((state) => state.tasks);
  const sortedTasks = useMemo(() => {
    // Sorting
    let result = [...tasks].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    // Filtering
    if (selectedPicId !== 'all') {
      result = result.filter((task) => task.pic_id === selectedPicId);
    }
    return result;
  }, [tasks, selectedPicId]);

  // State untuk modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  const setModalTitle = useFormModal((state) => state.setModalTitle);
  const setFormId = useFormModal((state) => state.setFormId);

  // Fungsi panggil data
  const fetchActivities = useActivities((state) => state.fetchActivities);
  const fetchPics = usePics((state) => state.fetchPics);
  const fetchTasks = useTasks((state) => state.fetchTasks);

  // Ambil tasks ketika halaman dimuat
  useEffect(() => {
    const fetchAll = () => {
      fetchActivities();
      fetchPics();
      fetchTasks();
    };
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

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
          {/* Pindah ke Halaman Summary */}
          <Button>
            <Link to="/summary">Summary</Link>
          </Button>
          {/* Filter PIC */}
          <Select value={selectedPicId} onValueChange={setSelectedPicId}>
            <SelectTrigger className="w-[160px] bg-neutral-100">
              <SelectValue placeholder="Pilih PIC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>PIC</SelectLabel>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value={null}>-</SelectItem>
                {pics.map((pic) => (
                  <SelectItem value={pic.id} key={pic.id}>
                    {pic.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Akhir Filter PIC */}
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
          <ModeToggle />
        </div>
      </header>
      {/* Main */}
      <main className="flex gap-4 p-4 flex-1">
        {columns.map((column) => (
          <StatusColumn
            key={column.id}
            title={column.title}
            tasks={sortedTasks.filter((task) => task.status === column.id)}
          />
        ))}
      </main>
      {/* Footer */}
      <footer className="flex items-center justify-center h-[39px] bg-nav py-2">
        <p className="text-white font-normal">
          &copy; {new Date().getFullYear()} Kanban App
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
