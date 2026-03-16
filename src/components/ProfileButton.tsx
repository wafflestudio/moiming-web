import UserAvatar from '@/components/UserAvatar';
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
            className="w-8 h-8 sm:w-10 sm:h-10 border-2"
            fallbackClassName="font-semibold text-md sm:text-lg"
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
          <DropdownMenuItem onClick={handleLogout}>
            <span className="text-destructive">로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
