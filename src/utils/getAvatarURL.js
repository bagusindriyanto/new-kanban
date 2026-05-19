export const getAvatarURL = (avatarPath) => {
  return avatarPath
    ? `${import.meta.env.VITE_API_BASE_URL}/${avatarPath}`
    : null;
};
