import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarURL } from '@/utils/getAvatarURL';

const getAliasName = (name) => {
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[1].charAt(0).toUpperCase()
    );
  } else if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  } else {
    return 'U';
  }
};

const getAvatarColor = (name) => {
  if (!name) return 'hsl(0, 0%, 60%)';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 60%, 45%)`;
};

const ProfileAvatar = ({ profile, size }) => {
  const avatarName = profile?.full_name ?? 'User';

  const avatarColor = getAvatarColor(avatarName);
  const aliasName = getAliasName(avatarName);
  const avatarURL = getAvatarURL(profile?.avatar ?? null);

  return (
    <Avatar size={size}>
      <AvatarImage src={avatarURL} alt={avatarName} />
      <AvatarFallback
        className="text-white"
        style={{ backgroundColor: avatarColor }}
      >
        {aliasName}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
