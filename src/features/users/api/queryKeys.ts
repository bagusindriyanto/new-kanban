export const userKeys = {
  all: ['users'] as const,
  currentUser: (userId: string) => [...userKeys.all, userId] as const,
};

export type UserKeys =
  | typeof userKeys.all
  | ReturnType<typeof userKeys.currentUser>;
