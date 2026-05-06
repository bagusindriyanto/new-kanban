import { ClipboardCheck } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const EmptyState = ({ title, description }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardCheck />
        </EmptyMedia>
        <EmptyTitle>{title || 'Tidak Ada Task'}</EmptyTitle>
        <EmptyDescription>
          {description ||
            'Anda belum menambahkan task. Klik tombol Tambah Task untuk mulai membuat daftar aktivitasmu.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
