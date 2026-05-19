import { format, parse } from 'date-fns';

export const formatToSQL = (date) => {
  if (!date) return null;

  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
};

export const parseFromSQL = (sqlDate) => {
  if (!sqlDate) return '-';

  const parsed = parse(sqlDate, 'yyyy-MM-dd HH:mm:ss', new Date());
  return format(parsed, 'd/M/yyyy, HH:mm:ss');
};
