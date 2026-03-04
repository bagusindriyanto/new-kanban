import { NavLink } from 'react-router';
import { LayoutDashboard, BarChart3, FileText, LogOut } from 'lucide-react';

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
import ModeToggle from './ModeToggle';
import useAuth from '@/stores/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const navItems = [
  { to: '/', label: 'Kanban Board', icon: LayoutDashboard },
  { to: '/summary', label: 'Summary', icon: BarChart3 },
  { to: '/changelog', label: 'Changelog', icon: FileText },
];

const AppSidebar = () => {
  const { user, clearUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.promise(api.post('/logout.php'), {
      loading: 'Sedang memproses logout...',
      success: () => {
        clearUser();
        navigate('/login');
        return 'Logout berhasil.';
      },
      error: (err) => err.response?.data?.message || 'Logout gagal.',
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-lg font-bold">Kanban App</span>
          <ModeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.to} end={item.to === '/'}>
                      <item.icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
              <span className="truncate">{user?.name ?? 'User'}</span>
              <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                {user?.role ?? '-'}
              </span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
