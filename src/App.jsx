import './App.css';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/Router';

import useAuthStore from './stores/authStore';
import { api, getAccessToken } from './lib/axios';
import { Toaster } from './components/ui/sonner';
import useFilterStore from './stores/filterStore';

const App = () => {
  const { setUser, clearUser } = useAuthStore();
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  useEffect(() => {
    const checkUser = async () => {
      const token = getAccessToken();
      if (!token) {
        clearUser();
        return;
      }

      try {
        const res = await api.get('/auth/me');
        const user = res.data.user;
        setUser(user);
        setSelectedUserId(user.id);
      } catch (err) {
        console.error(err.response?.data?.message);
        clearUser();
      }
    };

    checkUser();
  }, [setUser, clearUser, setSelectedUserId]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
};

export default App;
