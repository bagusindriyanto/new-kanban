import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarURL } from '@/utils/getAvatarURL';

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
  const avatarName = profile.name ?? profile.pic_name ?? 'User';

  const avatarColor = getAvatarColor(avatarName);
  const avatarURL = getAvatarURL(profile.avatar ?? profile.pic_avatar ?? null);

  return (
    <Avatar size={size}>
      <AvatarImage src={avatarURL} alt={avatarName} />
      <AvatarFallback
        className="text-white"
        style={{ backgroundColor: avatarColor }}
      >
        {avatarName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
