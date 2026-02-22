import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { Link } from 'react-router';
import { ArrowUp } from 'lucide-react';

const timelineData = [
  {
    date: '23 Feb 2026',
    title: '2.3.1',
    content: (
      <>
        <p className="mb-4">Memperbaiki:</p>
        <ul>
          <li className="flex items-center gap-2">
            🕔 Lama aktivitas{' '}
            <Badge className="bg-orange-300 text-orange-700 dark:bg-orange-700 dark:text-orange-300">
              On Progress
            </Badge>{' '}
            tidak terhitung dengan benar pada halaman Summary
          </li>
        </ul>
        <p className="mt-6 mb-4">Meningkatkan:</p>
        <ul>
          <li className="flex items-center gap-2">🚅 Performa aplikasi</li>
        </ul>
      </>
    ),
  },
  {
    date: '18 Feb 2026',
    title: '2.3.0',
    content: (
      <>
        <p className="mb-4">Menambahkan:</p>
        <ul>
          <li className="flex items-center gap-2">⏰ Fitur jadwalkan task</li>
          <li className="flex items-center gap-2">
            📌 Daftar task yang akan dimulai dalam 30 menit ke depan
          </li>
          <li className="flex items-center gap-2">
            📊 Grafik proporsi aktivitas, untuk menunjukkan proporsi aktivitas
            dalam 1 waktu
          </li>
        </ul>
        <p className="mt-6 mb-4">Memperbarui:</p>
        <ul>
          <li className="flex items-center gap-2">
            🖥️ Tampilan UI halaman Summary
          </li>
        </ul>
      </>
    ),
  },
  {
    date: '6 Nov 2025',
    title: '2.2.0',
    content: (
      <>
        <p className="mb-4">Menambahkan:</p>
        <ul>
          <li className="flex items-center gap-2">🔄 Fitur refresh data</li>
          <li className="flex items-center gap-2">
            ℹ️ Notifikasi ketika sedang offline/terjadi kesalahan pada server
          </li>
        </ul>
      </>
    ),
  },
  {
    date: '21 Okt 2025',
    title: '2.1.2',
    content: (
      <>
        <p className="mb-4">Meningkatkan:</p>
        <ul>
          <li className="flex items-center gap-2">🚅 Performa aplikasi</li>
        </ul>
      </>
    ),
  },
  {
    date: '4 Okt 2025',
    title: '2.1.1',
    content: (
      <>
        <p className="mb-4">Meningkatkan:</p>
        <ul>
          <li className="flex items-center gap-2">🚅 Performa aplikasi</li>
        </ul>
      </>
    ),
  },
  {
    date: '22 Sep 2025',
    title: '2.1.0',
    content: (
      <>
        <p className="mb-4">Menambahkan:</p>
        <ul>
          <li className="flex items-center gap-2">
            📅 Filter task berdasarkan tanggal
          </li>
          <li className="flex items-center gap-2">
            ⚙️ Otomatis menyimpan preferensi filter terakhir yang digunakan
          </li>
        </ul>
      </>
    ),
  },
  {
    date: '20 Sep 2025',
    title: '2.0.0 - Halaman Summary',
    content: (
      <>
        <p className="mb-4">Menambahkan:</p>
        <ul>
          <li className="flex items-center gap-2">
            📊 Halaman Summary, menampilkan informasi:
          </li>
          <ul className="list-disc ml-12 my-1 font-light">
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
          </ul>
          <li className="flex items-center gap-2">🌙 Mode Gelap</li>
        </ul>
      </>
    ),
  },
  {
    date: '11 Sep 2025',
    title: '1.1.0',
    content: (
      <>
        <p className="mb-4">Menambahkan:</p>
        <ul>
          <li className="flex items-center gap-2">
            🧑‍💼 Filter task berdasarkan PIC
          </li>
          <li className="flex items-center gap-2">
            ✏️ Fitur edit dan hapus task
          </li>
          <li className="flex items-center gap-2">
            ℹ️ Notifikasi status tambah/edit/hapus aktivitas, PIC, dan task
          </li>
        </ul>
      </>
    ),
  },
  {
    date: '9 Sep 2025',
    title: '1.0.2',
    content: (
      <>
        <p className="mb-4">Meningkatkan:</p>
        <ul>
          <li className="flex items-center gap-2">🚅 Performa aplikasi</li>
        </ul>
      </>
    ),
  },
  {
    date: '4 Sep 2025',
    title: '1.0.1',
    content: (
      <>
        <p className="mb-4">Memperbarui:</p>
        <ul>
          <li className="flex items-center gap-2">🖥️ Tampilan UI</li>
        </ul>
      </>
    ),
  },
  {
    date: '28 Agu 2025',
    title: '1.0.0 - Rilis Awal',
    content: (
      <>
        <p className="mb-4">Menambahkan:</p>
        <ul>
          <li className="flex items-center gap-2">
            ➕ Tambah Aktivitas, PIC, dan Task dengan judul dan detail task
          </li>
          <li className="flex items-center gap-2">
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
          </li>
          <li className="flex items-center gap-2">
            ⏸️ Pause aktivitas ketika sedang menjalankan aktivitas lain
          </li>
          <li className="flex items-center gap-2">
            📄 Tampilan board berbasis kolom
          </li>
        </ul>
      </>
    ),
  },
];

const Timeline = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl mb-12">
        <Button variant="secondary" className="shadow-sm" asChild>
          <Link to="/">Kembali ke halaman utama</Link>
        </Button>
      </div>
      <h1 className="mb-10 text-center text-3xl font-bold tracking-tighter text-foreground sm:text-6xl">
        Kanban App Changelog
      </h1>
      <div className="relative mx-auto max-w-4xl">
        <Separator
          orientation="vertical"
          className="absolute top-4 left-2 bg-muted"
        />
        {timelineData.map((entry, index) => (
          <div key={index} className="relative mb-10 pl-8">
            <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-foreground" />
            <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
              {entry.title}
            </h4>

            <h5 className="text-md top-3 -left-34 rounded-xl tracking-tight text-muted-foreground xl:absolute">
              {entry.date}
            </h5>

            <Card className="my-5">
              <CardContent>
                <div className="prose text-foreground dark:prose-invert">
                  {entry.content}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl mt-12 flex justify-center">
        <Button variant="link">
          <ArrowUp />
          <a href="#top">Kembali ke atas</a>
        </Button>
      </div>
    </section>
  );
};

export { Timeline };
