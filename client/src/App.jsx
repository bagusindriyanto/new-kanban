import './App.css';
import { Routes, Route } from 'react-router';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SummaryPage from './pages/SummaryPage';
import ChangelogPage from './pages/ChangelogPage';
import SettingsPage from './pages/SettingsPage';

import useAuth from './stores/authStore';
import { useEffect } from 'react';
import { api } from './lib/api';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from './components/ui/sonner';
import useFilter from './stores/filterStore';

const App = () => {
  const { setUser, clearUser } = useAuth();
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);

  useEffect(() => {
    api
      .get('/me.php')
      .then((res) => {
        setUser(res.data.user);
        setSelectedPicId(res.data.user.id);
      })
      .catch(() => clearUser());
  }, [setUser, clearUser, setSelectedPicId]);

  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={['Admin', 'Manager', 'Supervisor', 'Staff']}
            />
          }
        >
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
};

export default App;
