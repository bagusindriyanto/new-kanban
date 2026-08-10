export const upcomingTaskKeys = {
  all: ['upcoming-tasks'] as const,
  detail: (userId: string) => [...upcomingTaskKeys.all, userId] as const,
};
