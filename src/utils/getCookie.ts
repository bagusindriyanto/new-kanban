export const getCookie = (name: string): string | undefined => {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match?.split('=')[1];
};
