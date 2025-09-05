import { useEffect, useState } from 'react';
import './App.css';
import NavButton from './components/NavButton';
import Column from './components/Column';
import Modal from './components/Modal';
import { DndContext } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Toaster } from '@/components/ui/sonner';
import useActivities from './stores/activitiesStore';
import usePics from './stores/picsStore';
import useTasks from './stores/tasksStore';

const App = () => {
  // State untuk data
  const pics = usePics((state) => state.pics);
  const tasks = useTasks((state) => state.tasks);
  const moveTask = useTasks((state) => state.moveTask);

  // State untuk buka tutup modal
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk id form
  const [idForm, setIdForm] = useState(null);

  // Fungsi panggil data
  const fetchActivities = useActivities((state) => state.fetchData);
  const fetchPics = usePics((state) => state.fetchData);
  const fetchTasks = useTasks((state) => state.fetchData);

  // Add activity
  // const addActivity = async (name) => {
  //   try {
  //     const res = await fetch('http://localhost/kanban/api/activities.php', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name }),
  //     });
  //     if (!res.ok) throw new Error('Failed to add activity');
  //     // const newActivity = await res.json();
  //     // setActivities((prev) => [newActivity, ...prev]);
  //     await fetchActivities(); // Refresh tasks in case new activity is needed
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  // Add PIC
  // const addPic = async (name) => {
  //   try {
  //     const res = await fetch('http://localhost/kanban/api/pics.php', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name }),
  //     });
  //     if (!res.ok) throw new Error('Failed to add PIC');
  //     // const newPic = await res.json();
  //     // setPics((prev) => [newPic, ...prev]);
  //     await fetchPics(); // Refresh tasks in case new PIC is needed
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  // Add Task
  // const addTask = async (content, pic_id, detail) => {
  //   try {
  //     const now = new Date().toISOString();
  //     const res = await fetch('http://localhost/kanban/api/tasks.php', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         content,
  //         pic_id,
  //         detail,
  //         status: 'todo',
  //         timestamp_todo: now,
  //         timestamp_progress: null,
  //         timestamp_done: null,
  //         timestamp_archived: null,
  //         minute_pause: 0,
  //         minute_activity: 0,
  //         pause_time: null,
  //       }),
  //     });
  //     if (!res.ok) throw new Error('Failed to add task');
  //     await fetchTasks();
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

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

  const handleOpenModal = (type, id) => {
    // Buka Modal
    setIsModalOpen(true);
    // Set tipe modalnya
    setModalType(type);
    // Set id formnya
    setIdForm(id);
  };

  // Fungsi untuk handle task yang di drag
  const handleDragEnd = (event) => {
    // Ambil posisi drag element = active dan drop element = over
    const { active, over } = event;
    // Jika element di drag ke daerah yang bukan droppable
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
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              pics={pics}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </DndContext>
      </main>
      {/* Footer */}
      <footer className="flex items-center justify-center bg-sky-950 py-2">
        <p className="text-white">
          &copy; {new Date().getFullYear()} Kanban App
        </p>
      </footer>
      {/* <Modal /> */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={modalType}
        idForm={idForm}
      ></Modal>
      {/* Toast */}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default App;
