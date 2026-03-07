import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name?: string | null;
  imageUrl?: string | null;
  className?: string; // 컨테이너(Avatar)용 클래스
  fallbackClassName?: string; // 이니셜(AvatarFallback)용 클래스
}

export default function UserAvatar({
  name,
  imageUrl,
  className = '',
  fallbackClassName = '',
}: UserAvatarProps) {
  return (
    <Avatar
      className={`w-12 h-12 sm:w-16 sm:h-16 border-none shadow-sm shrink-0 ${className}`.trim()}
      title={name ?? undefined}
    >
      <AvatarImage
        src={imageUrl ?? undefined}
        alt={name ?? '사용자 아바타'}
        className="object-cover"
      />
      <AvatarFallback
        className={`bg-blue-100 text-primary text-xs sm:text-sm font-semibold ${fallbackClassName}`.trim()}
      >
        {name?.slice(0, 3)}
      </AvatarFallback>
    </Avatar>
  );
}
