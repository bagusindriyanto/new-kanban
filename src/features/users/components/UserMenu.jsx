import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import useAuthStore from '@/stores/authStore';
import { EllipsisVerticalIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api, getRefreshToken } from '@/lib/axios';
import { useNavigate } from 'react-router';
import { queryClient } from '@/lib/queryClient';
import UserAvatar from './UserAvatar';

const AccountMenu = () => {
  const { currentUser, clearCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.promise(
      api.post('/auth/logout', { refresh_token: getRefreshToken() }),
      {
        loading: 'Sedang memproses logout...',
        success: () => {
          clearCurrentUser();
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
            <UserAvatar profile={currentUser.profile} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {currentUser.profile.name ?? 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {currentUser.role.name ?? '-'}
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
              <UserAvatar profile={currentUser.profile} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentUser.profile.name ?? 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.role.name ?? '-'}
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
