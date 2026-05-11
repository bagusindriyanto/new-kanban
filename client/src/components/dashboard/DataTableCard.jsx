// import { utils, writeFileXLSX } from 'xlsx';
import { utils, writeFileXLSX } from 'xlsx-js-style';
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

const EMPTY_DATA = [];

const DataTableCard = ({ data = EMPTY_DATA }) => {
  const exportFile = () => {
    // 1. Create sheet with data starting from row 3 (A3)
    const excelData = data.map((row, i) => ({
      No: i + 1,
      PIC: row.pic_name,
      Aktivitas: row.content,
      'Total Durasi': row.total_minutes,
      Jumlah: row.total_tasks,
      'Rata-rata Durasi': row.avg_minutes,
    }));

    const ws = utils.json_to_sheet(excelData, { origin: 'A3' });

    // 2. Add title at row 1 (A1)
    utils.sheet_add_aoa(ws, [['Tabel Aktivitas']], { origin: 'A1' });

    // 3. Optional: Style the title (bold, size 14) and merge cells
    // Note: requires xlsx-js-style which you already imported
    if (ws['A1']) {
      ws['A1'].s = {
        font: { bold: true, sz: 14 },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      };
    }

    // Merge from column A to E (adjust 'c: 4' based on your total columns)
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

    // 4. Apply Zebra Styling and Borders
    const range = utils.decode_range(ws['!ref']);
    for (let R = 2; R <= range.e.r; ++R) {
      // Row index 2 is A3 (the table header)
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue; // Skip empty cells

        // Initialize style object if it doesn't exist
        if (!ws[cellAddress].s) ws[cellAddress].s = {};

        // Apply borders to all table cells
        ws[cellAddress].s.border = {
          top: { style: 'thin', color: { rgb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
          left: { style: 'thin', color: { rgb: 'E2E8F0' } },
          right: { style: 'thin', color: { rgb: 'E2E8F0' } },
        };

        if (R === 2) {
          // Table Header (A3:E3)
          ws[cellAddress].s.fill = { fgColor: { rgb: 'E2E2E2' } }; // Light gray header
          ws[cellAddress].s.font = { bold: true };
        } else if (R > 2 && R % 2 !== 1) {
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
    writeFileXLSX(
      wb,
      `data-aktivitas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`,
    );
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
          <Button onClick={exportFile} disabled={data.length === 0}>
            <DownloadIcon data-icon="inline-start" />
            Unduh Data
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
