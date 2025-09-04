import { useEffect, useState } from 'react';
import './App.css';
import NavButton from './components/NavButton';
import Column from './components/Column';
import Modal from './components/Modal';
import { DndContext } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

const App = () => {
  // State untuk task
  const [tasks, setTasks] = useState([]);
  const [pics, setPics] = useState([]);

  // State untuk buka tutup modal
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get tasks data
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost/kanban/api/tasks.php');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  // Get pics data
  const fetchPics = async () => {
    try {
      const res = await fetch('http://localhost/kanban/api/pics.php');
      const data = await res.json();
      setPics(data);
    } catch (err) {
      console.error('Failed to fetch pics', err);
    }
  };

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
    fetchTasks();
    fetchPics();
  }, []);

  const handleOpenModal = (type) => {
    setIsModalOpen(true);
    // Set tipe modalnya
    setModalType(type);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      setTasks(() =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-sky-950 px-5 py-3">
        <h1 className="text-2xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2">
          <NavButton onClick={() => handleOpenModal('Tambah Activity')}>
            Add Activity
          </NavButton>
          <NavButton onClick={() => handleOpenModal('Tambah PIC')}>
            Add PIC
          </NavButton>
          <NavButton onClick={() => handleOpenModal('Tambah Task')}>
            Add Task
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
        onOpenChange={handleCloseModal}
        title={modalType}
      ></Modal>
    </div>
  );
};

export default App;
