import './App.css';
import { useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Toaster } from '@/components/ui/sonner';
import NavButton from './components/NavButton';
import StatusColumn from './components/StatusColumn';
import FormModal from './components/FormModal';
import ConfirmModal from './components/ConfirmModal';
import useActivities from './stores/activityStore';
import usePics from './stores/picStore';
import useTasks from './stores/taskStore';
import useFormModal from './stores/formModalStore';
import TaskCard from './components/TaskCard';

const App = () => {
  // State untuk data
  const pics = usePics((state) => state.pics);
  const tasks = useTasks((state) => state.tasks);
  const moveTask = useTasks((state) => state.moveTask);

  // State untuk card yang sedang di drag
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [activePicName, setActivePicName] = useState(null);

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

  // Fungsi untuk handle task yang di drag
  // Ketika drag dimulai
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const task = tasks.find((task) => active.id === task.id);
    setActiveTask(task);
    const picName = pics.find((p) => p.id === task.pic_id)?.name;
    setActivePicName(picName);
  };

  // Ketika drag berakhir
  const handleDragEnd = (event) => {
    // Ambil posisi drag element = active dan drop element = over
    const { active, over } = event;
    setActiveId(null);
    setActiveTask(null);
    setActivePicName(null);
    // Jika element di drag ke daerah yang bukan droppable
    console.log('Active: ', active.id, '; Over: ', over);

    if (over && active.id !== over.id) {
      // Update task ketika di drag
      const taskId = active.id;
      const newStatus = over.id;
      // Update state tasks
      moveTask(taskId, newStatus);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-sky-950 px-5 py-3">
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
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          {columns.map((column) => (
            <StatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
          <DragOverlay>
            {activeId ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </main>
      {/* Footer */}
      <footer className="flex items-center justify-center bg-sky-950 py-2">
        <p className="text-white">
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
