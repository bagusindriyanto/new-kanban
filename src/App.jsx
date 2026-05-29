import './App.css';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/Router';

import useAuthStore from './stores/authStore';
import { api, getAccessToken } from './lib/axios';
import { Toaster } from './components/ui/sonner';
import useFilter from './stores/filterStore';

const App = () => {
  const { setUser, clearUser } = useAuthStore();
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);

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
        setSelectedPicId(user.pic.id);
      } catch (err) {
        console.error(err.response?.data?.message);
        clearUser();
      }
    };

    checkUser();
  }, [setUser, clearUser, setSelectedPicId]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
};

export default App;
