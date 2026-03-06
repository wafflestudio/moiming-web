import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/schemas';
import { useNavigate } from 'react-router';
import UserAvatar from './UserAvatar';

interface ProfileButtonProps {
  user: User;
  handleLogout: () => void;
}

export default function ProfileButton({
  user,
  handleLogout,
}: ProfileButtonProps) {
  const navigate = useNavigate();

  const goToProfileEdit = () => {
    navigate('/profile');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <UserAvatar
            name={user.name}
            imageUrl={user.profileImage}
            className="w-10 h-10 sm:w-12 sm:h-12 border-2"
            fallbackClassName="text-[12px] sm:text-[14px]"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuLabel>
          <span className="font-bold">{user.name}</span> 님
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={goToProfileEdit}>
            프로필 수정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
