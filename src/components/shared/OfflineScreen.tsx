import { RotateCwIcon, WifiOffIcon } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

const OfflineScreen = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WifiOffIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle className="text-destructive">
          Anda Sedang Offline
        </EmptyTitle>
        <EmptyDescription className="text-destructive/90">
          Mohon periksa koneksi internet Anda.
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

export default OfflineScreen;
