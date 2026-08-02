import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { getCookie } from '@/utils/getCookie';

const defaultOpen = getCookie('sidebar_state') !== 'false'; // default true kalau belum ada cookie

const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
