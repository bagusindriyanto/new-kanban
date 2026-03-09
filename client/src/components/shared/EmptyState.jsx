import { ClipboardCheck } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const EmptyState = ({ title, description, action }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardCheck />
        </EmptyMedia>
        <EmptyTitle>{title || 'Tidak Ada Task'}</EmptyTitle>
        <EmptyDescription>
          {description ||
            'Kamu belum menambahkan task. Klik tombol di bawah ini untuk mulai membuat daftar aktivitasmu.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
};

export default EmptyState;
