import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeftIcon, EllipsisVertical } from 'lucide-react';

type DropdownOptions = {
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export default function Subheader({
  title,
  onBackClick,
  dropdownOptions,
}: {
  title: string;
  onBackClick: () => void;
  dropdownOptions?: DropdownOptions;
}) {
  return (
    <header className="w-full flex justify-center">
      <div className="max-w-2xl w-full flex justify-between items-center pl-2 pr-6 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBackClick}
            className="rounded-full"
          >
            <ChevronLeftIcon className="size-6" />
          </Button>
          <h2>{title}</h2>
        </div>
        {dropdownOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <EllipsisVertical className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuItem
                onClick={dropdownOptions.onEditClick}
                className="cursor-pointer"
              >
                수정하기
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent text-red-600 font-medium">
                    삭제하기
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      정말 일정을 삭제하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      삭제된 일정은 복구할 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={dropdownOptions.onDeleteClick}
                      className="bg-primary text-white hover:bg-primary/90 rounded-lg"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
