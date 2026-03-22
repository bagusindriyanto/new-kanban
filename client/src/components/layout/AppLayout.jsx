import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useFetchTasks } from '@/api/fetchTasks';
import useNotification from '@/stores/notificationStore';
import { useEffect } from 'react';
import useDeadlineChecker from '@/hooks/useDeadlineChecker';
import useTaskFilters from '@/hooks/useTaskFilters';

const AppLayout = () => {
  // Get query params from global filters
  const { queryParams } = useTaskFilters();

  // Global task fetching for notifications
  const { data: tasks } = useFetchTasks(queryParams);

  // Global current time updater
  const updateCurrentTime = useNotification((state) => state.updateCurrentTime);

  useEffect(() => {
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  // Global deadline checker
  useDeadlineChecker(tasks);

  const stored = localStorage.getItem('sidebar_state');
  const defaultOpen = stored !== null ? JSON.parse(stored) : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
