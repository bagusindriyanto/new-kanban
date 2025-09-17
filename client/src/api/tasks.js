import axios from 'axios';

export const fetchTasksByStatus = async ({ pageParam = 1, queryKey }) => {
  const status = queryKey[1];
  const res = await axios.get('http://localhost/kanban/api/tasks.php', {
    params: {
      status,
      page: pageParam,
      limit: 5,
    },
  });
  return res.data;
};
