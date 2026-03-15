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
      className={`size-10 border-none shrink-0 ${className}`.trim()}
      title={name ?? undefined}
    >
      <AvatarImage
        src={imageUrl ?? undefined}
        alt={name ?? '사용자 아바타'}
        className="object-cover"
      />
      <AvatarFallback
        className={`bg-ring font-semibold text-lg text-[#F1F6FD] ${fallbackClassName}`.trim()}
      >
        {name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
}
