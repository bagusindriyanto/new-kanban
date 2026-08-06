import { ClipboardCheckIcon } from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const EmptyScreen = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardCheckIcon />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Task</EmptyTitle>
        <EmptyDescription>
          Anda belum menambahkan task. Klik tombol Tambah Task untuk mulai
          membuat daftar aktivitas Anda.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyScreen;
