import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import ModeToggle from './ModeToggle';
import UpcomingTasksPanel from '../tasks/UpcomingTasksPanel';
import AppBreadcrumb from './AppBreadcrumb';

const SiteHeader = () => {
  return (
    <header className="flex px-4 h-14 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2" />
        <AppBreadcrumb />
      </div>
      <div className="flex gap-2 items-center">
        <UpcomingTasksPanel />
        <ModeToggle />
      </div>
    </header>
  );
};

export default SiteHeader;
