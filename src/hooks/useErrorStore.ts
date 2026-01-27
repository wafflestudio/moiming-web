import { create } from 'zustand';

interface ErrorState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void; // 확인 버튼 클릭 시 실행할 콜백 함수
  showError: (message: string, title?: string, onConfirm?: () => void) => void;
  closeError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isOpen: false,
  title: '오류 발생',
  message: '',
  onConfirm: undefined,
  showError: (message, title = '오류 발생', onConfirm) =>
    set({ isOpen: true, message, title, onConfirm }),
  closeError: () => set({ isOpen: false, message: '', onConfirm: undefined }),
}));
