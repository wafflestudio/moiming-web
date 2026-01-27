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
  const { isOpen, title, message, onConfirm, closeError } = useErrorStore();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeError();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeError}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base whitespace-pre-wrap">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
