import './App.css';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import NavButton from './components/NavButton';
import StatusColumn from './components/StatusColumn';
import FormModal from './components/FormModal';
import ConfirmModal from './components/ConfirmModal';
import useActivities from './stores/activityStore';
import usePics from './stores/picStore';
import useTasks from './stores/taskStore';
import useFormModal from './stores/formModalStore';

const App = () => {
  // State untuk data
  const tasks = useTasks((state) => state.tasks);

  // State untuk modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  const setModalTitle = useFormModal((state) => state.setModalTitle);
  const setFormId = useFormModal((state) => state.setFormId);

  // Fungsi panggil data
  const fetchActivities = useActivities((state) => state.fetchActivities);
  const fetchPics = usePics((state) => state.fetchPics);
  const fetchTasks = useTasks((state) => state.fetchTasks);

  // Kolom status
  const columns = [
    {
      id: 'todo',
      title: 'TO DO',
    },
    {
      id: 'on progress',
      title: 'ON PROGRESS',
    },
    {
      id: 'done',
      title: 'DONE',
    },
    {
      id: 'archived',
      title: 'ARCHIVED',
    },
  ];

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
        <h1 className="text-2xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2">
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
        </div>
      </header>
      {/* Main */}
      <main className="flex gap-4 p-4 flex-1">
        {columns.map((column) => (
          <StatusColumn
            key={column.id}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </main>
      {/* Footer */}
      <footer className="flex items-center justify-center h-[39px] bg-nav py-2">
        <p className="text-white font-medium">
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

export default App;
