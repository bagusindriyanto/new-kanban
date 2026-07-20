import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'next-themes';

import { queryClient } from '@/lib/queryClient';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { router } from './router';
import { useAuthListener } from '@/features/auth/hooks/useAuthListener';

const AppProviders = () => {
  useAuthListener();

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
