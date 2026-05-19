import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import SiteHeader from './SiteHeader';

const AppLayout = () => {
  const stored = localStorage.getItem('sidebar_state');
  const defaultOpen = stored !== null ? JSON.parse(stored) : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
