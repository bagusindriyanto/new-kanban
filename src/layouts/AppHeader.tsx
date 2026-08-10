import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ModeToggle from '@/components/shared/ModeToggle';
import UpcomingTasksPanel from '@/features/upcoming-tasks/components/UpcomingTasksPanel';
import AppBreadcrumb from './AppBreadcrumb';
import ChatbotDrawer from '@/features/ai/components/ChatbotDrawer';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-background flex px-4 h-14 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />
        <AppBreadcrumb />
      </div>
      <div className="flex gap-2 items-center">
        <ChatbotDrawer />
        <UpcomingTasksPanel />
        <ModeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
