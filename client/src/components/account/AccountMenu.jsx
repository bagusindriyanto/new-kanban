import { useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import useAuthStore from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EllipsisVertical } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router';

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

const AccountMenu = () => {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const avatarColor = useMemo(
    () => getAvatarColor(user.name ?? 'User'),
    [user.name],
  );

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
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback
                className="size-8 rounded-lg text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {user.name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name ?? 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.role ?? '-'}
              </span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className="size-8 rounded-lg text-white"
                  style={{ backgroundColor: avatarColor }}
                >
                  {user.name?.charAt(0).toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
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
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AccountMenu;
