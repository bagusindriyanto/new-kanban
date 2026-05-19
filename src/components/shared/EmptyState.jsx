import { ClipboardCheckIcon } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const EmptyState = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardCheckIcon />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Task</EmptyTitle>
        <EmptyDescription>
          Anda belum menambahkan task. Klik tombol Tambah Task untuk mulai
          membuat daftar aktivitasmu.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
