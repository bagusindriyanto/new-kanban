import { api } from './api';

// const fetchTasksByStatus = async ({ pageParam = 1, queryKey }) => {
//   const status = queryKey[1];
//   const res = await api.get('/tasks.php', {
//     params: {
//       status,
//       page: pageParam,
//       limit: 5,
//     },
//   });
//   return res.data;
// };

const fetchTasksByStatus = async ({ pageParam = 1, queryKey }) => {
  try {
    const [_key, { status, picId }] = queryKey;
    const res = await api.get('/tasks.php', {
      params: {
        status,
        pic_id: picId === 'all' ? undefined : picId,
        page: pageParam,
        limit: 5,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

const addTask = async ({ content, pic_id, detail }) => {
  try {
    const now = new Date().toISOString();
    const res = await api.post('/tasks.php', {
      content,
      pic_id,
      detail,
      status: 'todo',
      timestamp_todo: now,
      timestamp_progress: null,
      timestamp_done: null,
      timestamp_archived: null,
      minute_pause: 0,
      minute_activity: 0,
      pause_time: null,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

const updateTask = async (taskId, data) => {
  try {
    const now = new Date().toISOString();
    const res = await api.patch('/tasks.php', {
      params: {
        id: taskId,
      },
      ...data,
      updated_at: now,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

const deleteTask = async (taskId) => {
  try {
    const res = await api.delete('/tasks.php', {
      params: {
        id: taskId,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export { fetchTasksByStatus, addTask, updateTask, deleteTask };
