import { createBrowserRouter } from 'react-router';
// import { lazy, Suspense } from 'react';

import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import HomePage from './pages/HomePage';
import SummaryPage from './pages/SummaryPage';
import ChangelogPage from './pages/ChangelogPage';
import SettingsPage from './pages/SettingsPage';

import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// import LoadingPage from './pages/LoadingPage';
// const HomePage = lazy(() => import('./pages/HomePage'));
// const SummaryPage = lazy(() => import('./pages/SummaryPage'));
// const ChangelogPage = lazy(() => import('./pages/ChangelogPage'));
// const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// const Lazy = ({ children }) => (
//   <Suspense fallback={<LoadingPage />}>{children}</Suspense>
// );

export const router = createBrowserRouter(
  [
    {
      element: <GuestRoute />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              path: '/login',
              element: <LoginPage />,
              handle: { breadcrumb: 'Login' },
            },
            {
              path: '/register',
              element: <RegisterPage />,
              handle: { breadcrumb: 'Register' },
            },
          ],
        },
      ],
    },
    {
      element: (
        <ProtectedRoute
          allowedRoles={['Admin', 'Manager', 'Supervisor', 'Staff']}
        />
      ),
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <HomePage />,
              handle: { breadcrumb: 'Kanban Board' },
            },
            {
              path: 'performance',
              element: <SummaryPage />,
              handle: { breadcrumb: 'Performance' },
            },
            {
              path: 'changelog',
              element: <ChangelogPage />,
              handle: { breadcrumb: 'Changelog' },
            },
            {
              path: 'settings',
              element: <SettingsPage />,
              handle: { breadcrumb: 'Pengaturan' },
            },
          ],
        },
      ],
    },
    { path: '/unauthorized', element: <UnauthorizedPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
  { basename: '/kanban' },
);
