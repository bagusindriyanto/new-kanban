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
import { EllipsisVerticalIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import UserAvatar from './UserAvatar';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useFetchProfile } from '@/features/auth/api/fetchProfile';
import { Skeleton } from '@/components/ui/skeleton';

const AccountMenu = () => {
  const { data: currentUser, isLoading } = useFetchProfile();
  const { mutateAsync: logoutMutation } = useLogout();

  const handleLogout = () => {
    toast.promise(logoutMutation, {
      loading: 'Sedang memproses logout...',
      success: () => {
        return 'Logout berhasil';
      },
      error: (err) => {
        return {
          message: 'Logout gagal',
          description: err.response?.data?.message || null,
        };
      },
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
            {isLoading ? (
              <>
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="grid flex-1 gap-1">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-3 w-[30px]" />
                </div>
              </>
            ) : (
              <>
                <UserAvatar profile={currentUser} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser.name ?? 'User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser.role.name ?? '-'}
                  </span>
                </div>
              </>
            )}
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side="right"
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              {isLoading ? (
                <>
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="grid flex-1 gap-1">
                    <Skeleton className="h-3 w-[80px]" />
                    <Skeleton className="h-3 w-[30px]" />
                  </div>
                </>
              ) : (
                <>
                  <UserAvatar profile={currentUser} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {currentUser.name ?? 'User'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser.role.name ?? '-'}
                    </span>
                  </div>
                </>
              )}
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
