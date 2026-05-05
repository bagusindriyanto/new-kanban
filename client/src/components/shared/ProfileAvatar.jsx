import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

const ProfileAvatar = ({ profile, className }) => {
  const avatarColor = getAvatarColor(profile.name ?? 'User');
  return (
    <Avatar className={className}>
      <AvatarImage src={profile.avatar} alt={profile.name} />
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
