import { RotateCwIcon, ServerOffIcon } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

const ErrorScreen = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerOffIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle className="text-destructive">Terjadi Kesalahan</EmptyTitle>
        <EmptyDescription className="text-destructive/90">
          {errorMessage || 'Gagal terhubung ke server.'}
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

export default ErrorScreen;
