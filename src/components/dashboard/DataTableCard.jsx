// xlsx-js-style is imported dynamically inside the exportFile function.
import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { DataTable } from '../table/data-table';
import { columns } from '../table/columns';
import { Button } from '../ui/button';
import { DownloadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Spinner } from '../ui/spinner';
import useFilterStore from '@/stores/filterStore';

const EMPTY_DATA = [];

const DataTableCard = ({ data = EMPTY_DATA }) => {
  const [isExporting, setIsExporting] = useState(false);
  const range = useFilterStore((state) => state.range);

  const dateLabel = range?.from
    ? range?.to
      ? range.from.getTime() === range.to.getTime()
        ? range.from.toLocaleDateString('id')
        : `${range.from.toLocaleDateString('id')} - ${range.to.toLocaleDateString('id')}`
      : range.from.toLocaleDateString('id')
    : 'Semua Hari';

  const dateToFileName = range?.from
    ? range?.to
      ? range.from.getTime() === range.to.getTime()
        ? format(range.from, 'yyyyMMdd')
        : `${format(range.from, 'yyyyMMdd')}_${format(range.to, 'yyyyMMdd')}`
      : format(range.from, 'yyyyMMdd')
    : 'all';

  const exportFile = async () => {
    setIsExporting(true);
    try {
      const { utils, writeFile } = await import('xlsx-js-style');
      // 1. Create sheet with data starting from row 5 (A5)
      const excelData = data.map((row, i) => ({
        No: i + 1,
        PIC: row.pic_name,
        Aktivitas: row.content,
        'Total Durasi (menit)': row.total_minutes,
        Jumlah: row.total_tasks,
        'Rata-rata Durasi (menit)': row.avg_minutes,
      }));

      const ws = utils.json_to_sheet(excelData, { origin: 'A6' });

      // 2. Add title at row 1 (A1)
      utils.sheet_add_aoa(ws, [['Data Aktivitas']], { origin: 'A1' });
      utils.sheet_add_aoa(ws, [[dateLabel]], {
        origin: 'A2',
      });
      utils.sheet_add_aoa(
        ws,
        [[`Diunduh pada: ${format(new Date(), 'dd/M/yyyy, HH:mm:ss')}`]],
        {
          origin: 'A4',
        },
      );

      // 3. Optional: Style the title (bold, size 14) and merge cells
      // Note: requires xlsx-js-style which you already imported
      if (ws['A1']) {
        ws['A1'].s = {
          font: { bold: true, sz: 16 },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        };
      }

      if (ws['A2']) {
        ws['A2'].s = {
          font: { bold: true, sz: 12 },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        };
      }

      // Merge from column A to E (adjust 'c: 4' based on your total columns)
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
      ];

      // 4. Apply Zebra Styling and Borders
      const range = utils.decode_range(ws['!ref']);
      for (let R = 5; R <= range.e.r; ++R) {
        // Row index 5 is A6 (the table header)
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = utils.encode_cell({ r: R, c: C });

          // If cell doesn't exist (e.g. empty data), create it so we can style it
          if (!ws[cellAddress]) {
            ws[cellAddress] = { t: 's', v: '', s: {} };
          }

          // Ensure style object exists (cells from json_to_sheet may lack it)
          if (!ws[cellAddress].s) {
            ws[cellAddress].s = {};
          }

          // Apply borders to all table cells
          ws[cellAddress].s.border = {
            top: { style: 'thin', color: { rgb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
            left: { style: 'thin', color: { rgb: 'E2E8F0' } },
            right: { style: 'thin', color: { rgb: 'E2E8F0' } },
          };

          if (R === 5) {
            // Table Header (A5:E5)
            ws[cellAddress].s.fill = { fgColor: { rgb: 'E2E2E2' } }; // Light gray header
            ws[cellAddress].s.font = { bold: true };
            ws[cellAddress].s.alignment = {
              wrapText: true,
              vertical: 'center',
              horizontal: 'center',
            };
          } else if (R > 5 && R % 2 !== 0) {
            // Alternating rows (odd indexes = even data rows)
            ws[cellAddress].s.fill = { fgColor: { rgb: 'F6F6F6' } }; // Very light gray stripe
          }
        }
      }

      // 5. Adjust Column Widths
      ws['!cols'] = [
        { wch: 5 }, // A: No
        { wch: 15 }, // B: PIC
        { wch: 30 }, // C: Aktivitas
        { wch: 15 }, // D: Total Durasi
        { wch: 8 }, // E: Jumlah
        { wch: 15 }, // F: Rata-rata Durasi
      ];

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Data');
      writeFile(wb, `data_aktivitas_${dateToFileName}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabel Aktivitas</CardTitle>
        <CardDescription>
          Menampilkan jenis aktivitas, total durasi, jumlah aktivitas, serta
          rata-rata durasi setiap aktivitas.
        </CardDescription>
        <CardAction>
          <Button
            onClick={exportFile}
            disabled={data.length === 0 || isExporting}
          >
            {isExporting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <DownloadIcon data-icon="inline-start" />
            )}
            {isExporting ? 'Memproses...' : 'Unduh Data'}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};

export default DataTableCard;
