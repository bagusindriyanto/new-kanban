import type { WorkTime } from '@/types/workTime';

export const workTimeKeys = {
  all: ['work-times'] as const,
  currentUser: (userId: string, date: string) =>
    [...workTimeKeys.all, { user_id: userId, date }] as const,
};

export type WorkTimeKeys =
  | typeof workTimeKeys.all
  | ReturnType<typeof workTimeKeys.currentUser>;

export type WorkTimeData = WorkTime | null;
