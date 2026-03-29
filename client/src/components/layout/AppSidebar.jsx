import { Link, useLocation } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import AccountMenu from '../account/AccountMenu';
import logo from '@/assets/logo.png';
import {
  SquareKanban,
  ChartNoAxesCombined,
  HelpCircle,
  User,
} from 'lucide-react';

const navMain = [
  { to: '/', label: 'Kanban Board', icon: SquareKanban },
  { to: '/summary', label: 'Ringkasan', icon: ChartNoAxesCombined },
];

const navSecondary = [
  { to: '/settings', label: 'Akun', icon: User },
  { to: '/changelog', label: 'Changelog', icon: HelpCircle },
];

const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              render={<Link to="/" />}
            >
              <img src={logo} alt="Kanban App" className="size-7 m-0.5" />
              <span className="truncate font-semibold font-heading tracking-tight text-lg">
                Kanban App
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={
                      item.to === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.to)
                    }
                    render={<Link to={item.to} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={
                      item.to === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.to)
                    }
                    render={<Link to={item.to} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AccountMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
