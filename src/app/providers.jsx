import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'next-themes';

import { queryClient } from '@/lib/queryClient';
import { getAccessToken } from '@/lib/axios';
import { me } from '@/features/auth/api/me';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import useAuthStore from '@/stores/authStore';
import useFilterStore from '@/stores/filterStore';
import { router } from './router';

const AppProviders = () => {
  const { setCurrentUser, clearCurrentUser } = useAuthStore();
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  useEffect(() => {
    const checkUser = async () => {
      const token = getAccessToken();
      if (!token) {
        clearCurrentUser();
        return;
      }

      try {
        const { user } = await me();
        setCurrentUser(user);
        setSelectedUserId(user.id);
      } catch (err) {
        console.error(err.response?.data?.message);
        clearCurrentUser();
      }
    };

    checkUser();
  }, [setCurrentUser, clearCurrentUser, setSelectedUserId]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
