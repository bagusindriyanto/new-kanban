import { RotateCwIcon, WifiOffIcon, ServerOffIcon } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const getMessage = (errorMessage?: string) =>
  errorMessage || 'Gagal terhubung ke server.';

export const ErrorBanner = ({
  isOnline,
  errorMessage,
  className,
}: {
  isOnline: boolean;
  errorMessage?: string;
  className?: string;
}) => {
  return (
    <Item className={cn('bg-destructive/15', className)} variant="muted">
      <ItemMedia variant="icon">
        {!isOnline ? (
          <WifiOffIcon className="text-destructive" />
        ) : (
          <ServerOffIcon className="text-destructive" />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-destructive">
          {!isOnline ? 'Anda Sedang Offline' : 'Terjadi Kesalahan'}
        </ItemTitle>
        <ItemDescription className="text-destructive/90">
          {!isOnline
            ? 'Mohon periksa koneksi internetmu.'
            : getMessage(errorMessage)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          variant="outline"
        >
          <RotateCwIcon />
          Refresh Halaman
        </Button>
      </ItemActions>
    </Item>
  );
};

export const ErrorFull = ({
  isOnline,
  errorMessage,
}: {
  isOnline: boolean;
  errorMessage?: string;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {!isOnline ? (
            <WifiOffIcon className="text-destructive" />
          ) : (
            <ServerOffIcon className="text-destructive" />
          )}
        </EmptyMedia>
        <EmptyTitle className="text-destructive">
          {!isOnline ? 'Anda Sedang Offline' : 'Terjadi Kesalahan'}
        </EmptyTitle>
        <EmptyDescription className="text-destructive/90">
          {!isOnline
            ? 'Mohon periksa koneksi internetmu.'
            : getMessage(errorMessage)}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RotateCwIcon />
          Refresh Halaman
        </Button>
      </EmptyContent>
    </Empty>
  );
};
