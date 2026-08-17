import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Fragment } from 'react';

type TimelineContent = {
  action:
    | 'Menambahkan:'
    | 'Memperbarui:'
    | 'Memperbaiki:'
    | 'Meningkatkan:'
    | 'Menghapus:';
  lists: React.ReactNode[];
};

type TimelineData = {
  date: string;
  title: string;
  content: TimelineContent[];
};

const timelineData: TimelineData[] = [
  {
    date: '6 Mar 2026',
    title: '3.0.0 - Sistem Log in',
    content: [
      {
        action: 'Menambahkan:',
        lists: ['🧑 Sistem log in akun', '👥 Tugaskan task ke PIC lain'],
      },
      {
        action: 'Memperbarui:',
        lists: ['🖥️ Tampilan UI'],
      },
      {
        action: 'Meningkatkan:',
        lists: ['🚅 Performa aplikasi'],
      },
    ],
  },
  {
    date: '23 Feb 2026',
    title: '2.3.1',
    content: [
      {
        action: 'Memperbaiki:',
        lists: [
          <>
            🕔 Lama aktivitas{' '}
            <Badge className="bg-orange-300 text-orange-700 dark:bg-orange-700 dark:text-orange-300">
              On Progress
            </Badge>{' '}
            tidak terhitung dengan benar pada halaman Ringkasan
          </>,
          `📅 Pilihan tanggal untuk “Jadwalkan Task” yang tidak tepat`,
        ],
      },
      {
        action: 'Meningkatkan:',
        lists: ['🚅 Performa aplikasi'],
      },
    ],
  },
  {
    date: '18 Feb 2026',
    title: '2.3.0',
    content: [
      {
        action: 'Menambahkan:',
        lists: [
          '📅 Fitur “Jadwalkan Task”',
          '📌 Daftar task yang akan dimulai dalam 30 menit ke depan',
          '📊 Grafik proporsi aktivitas, untuk menunjukkan proporsi aktivitas dalam 1 waktu',
        ],
      },
      {
        action: 'Memperbarui:',
        lists: ['🖥️ Tampilan UI halaman Ringkasan'],
      },
    ],
  },
  {
    date: '6 Nov 2025',
    title: '2.2.0',
    content: [
      {
        action: 'Menambahkan:',
        lists: [
          '🔄 Fitur “Refresh Data”',
          'ℹ️ Notifikasi ketika sedang offline/terjadi kesalahan pada server',
        ],
      },
    ],
  },
  {
    date: '21 Okt 2025',
    title: '2.1.2',
    content: [
      {
        action: 'Meningkatkan:',
        lists: ['🚅 Performa aplikasi'],
      },
    ],
  },
  {
    date: '4 Okt 2025',
    title: '2.1.1',
    content: [
      {
        action: 'Meningkatkan:',
        lists: ['🚅 Performa aplikasi'],
      },
    ],
  },
  {
    date: '22 Sep 2025',
    title: '2.1.0',
    content: [
      {
        action: 'Menambahkan:',
        lists: [
          '📅 Filter task yang sudah selesai berdasarkan tanggal',
          '⚙️ Otomatis menyimpan preferensi filter terakhir yang digunakan',
        ],
      },
    ],
  },
  {
    date: '20 Sep 2025',
    title: '2.0.0 - Halaman Ringkasan',
    content: [
      {
        action: 'Menambahkan:',
        lists: [
          '📊 Halaman Ringkasan, menampilkan informasi:',
          <ul key="ringkasan" className="list-disc ml-12 my-1 font-light">
            <li>Total aktivitas setiap status</li>
            <li>
              Operational time, yaitu perbandingan antara lama aktivitas dengan
              lama bekerja
            </li>
            <li>
              Tabel aktivitas yang menampilkan aktivitas yang sedang/selesai
              dikerjakan
            </li>
            <li>Grafik lama aktivitas vs lama bekerja setiap harinya</li>
          </ul>,
          '🌙 Mode Gelap',
        ],
      },
    ],
  },
  {
    date: '11 Sep 2025',
    title: '1.1.0',
    content: [
      {
        action: 'Menambahkan:',
        lists: [
          '👥 Filter task berdasarkan PIC',
          '✏️ Fitur edit dan hapus task',
          'ℹ️ Notifikasi status tambah/edit/hapus aktivitas, PIC, dan task',
        ],
      },
    ],
  },
  {
    date: '9 Sep 2025',
    title: '1.0.2',
    content: [
      {
        action: 'Meningkatkan:',
        lists: ['🚅 Performa aplikasi'],
      },
    ],
  },
  {
    date: '4 Sep 2025',
    title: '1.0.1',
    content: [
      {
        action: 'Memperbarui:',
        lists: ['🖥️ Tampilan UI'],
      },
    ],
  },
  {
    date: '28 Agu 2025',
    title: '1.0.0 - Rilis Awal',
    content: [
      {
        action: 'Menambahkan:',
        lists: [
          '➕ Tambah Aktivitas, PIC, dan Task yang akan dikerjakan.',
          <>
            ➡️ Update status{' '}
            <Badge className="bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300">
              To Do
            </Badge>
            <Badge className="bg-orange-300 text-orange-700 dark:bg-orange-700 dark:text-orange-300">
              On Progress
            </Badge>
            <Badge className="bg-green-300 text-green-700 dark:bg-green-700 dark:text-green-300">
              Done
            </Badge>
            <Badge className="bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              Archived
            </Badge>{' '}
            task dengan tombol kanan/kiri
          </>,
          '⏸️ Pause task ketika sedang menjalankan task lain',
          '📄 Tampilan board berbasis kolom',
        ],
      },
    ],
  },
];

const Timeline = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="py-10 px-4">
      <h1 className="mb-10 text-center text-3xl font-bold tracking-tighter text-foreground sm:text-6xl">
        Kanban App Changelog
      </h1>
      <div className="relative mx-auto max-w-3xl">
        <Separator
          orientation="vertical"
          className="absolute top-4 left-2 bg-muted"
        />
        {timelineData.map(({ title, date, content }, index) => (
          <div key={`timeline-${index}`} className="relative mb-10 pl-8">
            <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-foreground" />
            <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
              {title}
            </h4>

            <h5 className="text-md top-3 -left-34 rounded-xl tracking-tight text-muted-foreground xl:absolute">
              {date}
            </h5>

            <Card className="my-5">
              <CardContent>
                <div className="prose text-foreground dark:prose-invert">
                  {content.map(({ action, lists }, index) => (
                    <Fragment key={`content-${index}`}>
                      <p
                        className={cn(
                          'mb-4 font-semibold',
                          index > 0 && 'mt-6',
                        )}
                      >
                        {action}
                      </p>
                      <ul className="space-y-1">
                        {lists.map((list, index) => (
                          <li key={`list-${index}`}>{list}</li>
                        ))}
                      </ul>
                    </Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl mt-12 flex justify-center">
        <Button
          variant="link"
          className="text-foreground"
          onClick={handleBackToTop}
        >
          <ArrowUpIcon data-icon="inline-start" />
          Kembali ke atas
        </Button>
      </div>
    </div>
  );
};

export default Timeline;
