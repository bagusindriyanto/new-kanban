import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BASE_URL } from '@/lib/api';

const getAvatarColor = (name) => {
  if (!name) return 'hsl(0, 0%, 60%)';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 60%, 45%)`;
};

const ProfileAvatar = ({ profile, className }) => {
  const avatarColor = getAvatarColor(profile.name ?? 'User');
  const avatarUrl = profile.avatar ? `${BASE_URL}/${profile.avatar}` : null;

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} alt={profile.name} />
      <AvatarFallback
        className={cn('text-white', className)}
        style={{ backgroundColor: avatarColor }}
      >
        {profile.name?.charAt(0).toUpperCase() ?? 'U'}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
