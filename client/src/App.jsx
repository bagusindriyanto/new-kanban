import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/Button';
import Column from './components/Column';
import Modal from './components/Modal';
import { DndContext } from '@dnd-kit/core';

const App = () => {
  // Dummy data
  const columns = [
    {
      id: 'TODO',
      title: 'To Do',
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
    },
    {
      id: 'DONE',
      title: 'Done',
    },
    {
      id: 'ARCHIVED',
      title: 'Archived',
    },
  ];

  const initialTasks = [
    {
      id: 1,
      status: 'TODO',
      title: '1a. Belajar React',
      description: 'Lorem Ipsum',
    },
    {
      id: 2,
      status: 'TODO',
      title: '2a. Buat project kecil',
      description: 'Lorem Ipsum',
    },
    {
      id: 3,
      status: 'TODO',
      title: '3a. Ngoding fitur login',
      description: 'Lorem Ipsum',
    },
    {
      id: 4,
      status: 'IN_PROGRESS',
      title: '1b. Setup environment',
      description: 'Lorem Ipsum',
    },
    {
      id: 5,
      status: 'DONE',
      title: '1c. Install dependencies',
      description: 'Lorem Ipsum',
    },
    {
      id: 6,
      status: 'DONE',
      title: '2c. Setup environment',
      description: 'Lorem Ipsum',
    },
    {
      id: 7,
      status: 'ARCHIVED',
      title: '1d. Install dependencies',
      description: 'Lorem Ipsum',
    },
    {
      id: 8,
      status: 'ARCHIVED',
      title: '2d. Install dependencies',
      description: 'Lorem Ipsum',
    },
  ];

  // State untuk task
  const [tasks, setTasks] = useState(initialTasks);

  // Load tasks on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save changes tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Fungsi untuk handle task yang di drag
  const handleDragEnd = (event) => {
    // Ambil posisi drag element = active dan drop element = over
    const { active, over } = event;
    // console.log(active);
    // console.log(over);

    // Jika element di drag ke daerah yang bukan droppable
    if (!over) return;

    // Update task ketika di drag
    const taskId = active.id;
    const newStatus = over.id;

    // Update state tasks
    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between bg-sky-950 px-5 py-3">
        <h1 className="text-2xl font-semibold text-white">Kanban App</h1>
        <div className="flex gap-2">
          <Button>Add Activity</Button>
          <Button>Add PIC</Button>
          <Button>Add Task</Button>
        </div>
      </nav>
      <div className="flex gap-4 p-4">
        <DndContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </DndContext>
      </div>
      {/* <Modal /> */}
    </main>
  );
};

export default App;
