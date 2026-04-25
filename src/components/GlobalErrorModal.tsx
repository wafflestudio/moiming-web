import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useErrorStore } from '@/hooks/useErrorStore';

export function GlobalErrorModal() {
  const { isOpen, title, message, onConfirm, closeError, confirmText } =
    useErrorStore();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    // 페이지 이동 등 무거운 작업이 발생할 때 리액트 렌더링 사이클이 꼬이면서
    // 빈 모달이 깜빡이는 현상(Race condition)을 막기 위해 약간의 딜레이를 두고 닫음
    setTimeout(() => {
      closeError();
    }, 100);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // 바깥 영역 클릭(오버레이) 등 수동으로 닫을 때만 즉시 처리
      closeError();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-wrap">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm} autoFocus>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
