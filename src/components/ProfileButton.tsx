import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/user';

interface ProfileButtonProps {
  user: User;
  handleLogout: () => void;
}

export default function ProfileButton({
  user,
  handleLogout,
}: ProfileButtonProps) {
  const goToProfileEdit = () => {
    // TODO: Implement navigation to profile edit page
    console.info('Navigating to profile edit page...');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Avatar className="border-2">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
