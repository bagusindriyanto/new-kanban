import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import ModeToggle from './ModeToggle';

const SiteHeader = ({ titlePage = 'Kanban App', children }) => {
  return (
    <header className="flex px-4 h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-6"
        />
        <span className="text-sm font-medium tracking-tight">{titlePage}</span>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <ModeToggle />
      </div>
    </header>
  );
};

export default SiteHeader;
