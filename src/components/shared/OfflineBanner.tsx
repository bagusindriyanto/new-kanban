import { RotateCwIcon, WifiOffIcon } from 'lucide-react';
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

const OfflineBanner = ({ className }: { className?: string }) => {
  return (
    <Item className={cn('bg-destructive/15', className)} variant="muted">
      <ItemMedia variant="icon">
        <WifiOffIcon className="text-destructive" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-destructive">Anda Sedang Offline</ItemTitle>
        <ItemDescription className="text-destructive/90">
          Mohon periksa koneksi internet Anda.
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

export default OfflineBanner;
