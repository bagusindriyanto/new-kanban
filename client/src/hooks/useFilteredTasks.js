import { useMemo } from 'react';
import { startOfDay, parseISO } from 'date-fns';

const useFilteredTasks = (tasks, selectedPicId, range) => {
  return useMemo(() => {
    if (!tasks) return [];
    return [...tasks]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .filter((task) => {
        const matchedPic =
          selectedPicId === 'all' || task.pic_id === selectedPicId;

        let matchedDate;
        if (task.status === 'todo' || task.status === 'on progress') {
          matchedDate = true;
        } else {
          const fromDate = range.from;
          const toDate = range.to;
          const taskDate = task.timestamp_done
            ? startOfDay(parseISO(task.timestamp_done))
            : null;
          matchedDate =
            (!!taskDate || (!fromDate && !toDate)) &&
            (!fromDate || (taskDate && taskDate >= fromDate)) &&
            (!toDate || (taskDate && taskDate <= toDate));
        }

        return matchedPic && matchedDate;
      });
  }, [tasks, selectedPicId, range]);
};

export default useFilteredTasks;
