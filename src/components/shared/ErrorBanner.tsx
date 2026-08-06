import { RotateCwIcon, ServerOffIcon } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ErrorBanner = ({
  errorMessage,
  className,
}: {
  errorMessage?: string;
  className?: string;
}) => {
  return (
    <Item className={cn('bg-destructive/15', className)} variant="muted">
      <ItemMedia variant="icon">
        <ServerOffIcon className="text-destructive" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-destructive">Terjadi Kesalahan</ItemTitle>
        <ItemDescription className="text-destructive/90">
          {errorMessage || 'Gagal terhubung ke server.'}
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

export default ErrorBanner;
