import { format } from 'date-fns';

export const formatToSQL = (date: Date | null): string | null => {
  if (!date) return null;

  return new Date(date).toISOString();
};

export const parseFromSQL = (sqlDate: string | null): string => {
  if (!sqlDate) return '-';

  // const parsed = parse(sqlDate, 'yyyy-MM-dd HH:mm:ss', new Date());
  return format(sqlDate, 'd/M/yyyy, HH:mm:ss');
};
