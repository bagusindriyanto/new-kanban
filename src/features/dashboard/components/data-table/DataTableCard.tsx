import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import { useFilterStore } from '@/stores/filterStore';
import { tableColumns } from './DataTableColumns';
import DataTable from './DataTable';
import type { TableData } from '@/types/dashboard';
import type { JSON2SheetOpts, OriginOption } from 'xlsx-js-style';
import DataTableSearch from './DataTableSearch';
import { DataTablePagination } from './DataTablePagination';
import { useDataTable } from './useDataTable';

const EMPTY_DATA: TableData[] = [];

const DataTableCard = ({ data = EMPTY_DATA }) => {
  const [isExporting, setIsExporting] = useState(false);
  const range = useFilterStore((state) => state.range);

  const table = useDataTable({ data, columns: tableColumns });

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
        ? format(range.from, 'd-M-yyyy')
        : `${format(range.from, 'd-M-yyyy')} - ${format(range.to, 'd-M-yyyy')}`
      : format(range.from, 'd-M-yyyy')
    : 'all';

  const exportFile = async () => {
    setIsExporting(true);
    try {
      const { utils, writeFile } = await import('xlsx-js-style');
      // 1. Create sheet with data starting from row 5 (A5)
      const excelData = data.map((row, i) => ({
        No: i + 1,
        PIC: row.user.profile.full_name,
        Aktivitas: row.content,
        'Total Durasi (menit)': row.sum_effective_minute,
        Jumlah: row.tasks_count,
        'Rata-rata Durasi (menit)': row.avg_effective_minute,
      }));

      const ws = utils.json_to_sheet(excelData, {
        origin: 'A6',
      } as JSON2SheetOpts & OriginOption);

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
      if (!ws['!ref']) return;
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
        { wch: 25 }, // B: PIC
        { wch: 30 }, // C: Aktivitas
        { wch: 15 }, // D: Total Durasi
        { wch: 8 }, // E: Jumlah
        { wch: 15 }, // F: Rata-rata Durasi
      ];

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Data');
      writeFile(wb, `Data Aktivitas ${dateToFileName}.xlsx`);
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
        <div className="h-full">
          <div className="flex items-center mb-4">
            <DataTableSearch
              columnId="content"
              table={table}
              placeholder="Cari aktivitas..."
            />
          </div>
          <DataTable table={table} />
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTableCard;
