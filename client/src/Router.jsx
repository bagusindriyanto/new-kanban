import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';

import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoadingPage from './pages/LoadingPage';

import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const SummaryPage = lazy(() => import('./pages/SummaryPage'));
const ChangelogPage = lazy(() => import('./pages/ChangelogPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const Lazy = ({ children }) => (
  <Suspense fallback={<LoadingPage />}>{children}</Suspense>
);

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
              element: (
                <Lazy>
                  <HomePage />
                </Lazy>
              ),
              handle: { breadcrumb: 'Kanban Board' },
            },
            {
              path: 'performance',
              element: (
                <Lazy>
                  <SummaryPage />
                </Lazy>
              ),
              handle: { breadcrumb: 'Performance' },
            },
            {
              path: 'changelog',
              element: (
                <Lazy>
                  <ChangelogPage />
                </Lazy>
              ),
              handle: { breadcrumb: 'Changelog' },
            },
            {
              path: 'settings',
              element: (
                <Lazy>
                  <SettingsPage />
                </Lazy>
              ),
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
