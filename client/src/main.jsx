import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { queryClient } from './lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/kanban">
        <ThemeProvider attribute="class">
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
