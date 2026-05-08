import { utils, writeFileXLSX } from 'xlsx';
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
    const ws = utils.json_to_sheet(data);
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
