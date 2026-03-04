import './App.css';
import { Routes, Route } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SummaryPage from './pages/SummaryPage';
import ChangelogPage from './pages/ChangelogPage';
import useAuth from './stores/authStore';
import { useEffect } from 'react';
import { api } from './lib/api';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

const App = () => {
  const { setUser, clearUser } = useAuth();

  useEffect(() => {
    api
      .get('/me.php')
      .then((res) => setUser(res.data.user))
      .catch(() => clearUser());
  }, [setUser, clearUser]);

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
          <Route index element={<HomePage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
};

export default App;
