import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import useAuthStore from '@/stores/authStore';
import { EllipsisVerticalIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, getRefreshToken } from '@/lib/axios';
import { useNavigate } from 'react-router';
import ProfileAvatar from '../shared/ProfileAvatar';
import { queryClient } from '@/lib/queryClient';

const AccountMenu = () => {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.promise(
      api.post('/auth/logout', { refresh_token: getRefreshToken() }),
      {
        loading: 'Sedang memproses logout...',
        success: () => {
          clearUser();
          queryClient.clear();
          navigate('/login');
          return 'Logout berhasil';
        },
        error: (err) => {
          return {
            message: 'Logout gagal',
            description: err.response?.data?.message || null,
          };
        },
      },
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <ProfileAvatar profile={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name ?? 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.role ?? '-'}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side="right"
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <ProfileAvatar profile={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.name ?? 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.role ?? '-'}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOutIcon />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AccountMenu;
