import { api } from './api';

const fetchPics = async () => {
  const [_key, { status, picId }] = queryKey;
  const res = await api.get('/pics.php', {
    params: {
      status,
      pic_id: picId === 'all' ? undefined : picId,
      page: pageParam,
      limit: 5,
    },
  });
  return res.data;
};
