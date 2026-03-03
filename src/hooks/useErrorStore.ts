import { create } from 'zustand';

interface ErrorState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm?: () => void; // 확인 버튼 클릭 시 실행할 콜백 함수
  showError: (
    message: string,
    title?: string,
    onConfirm?: () => void,
    confirmText?: string
  ) => void;
  closeError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isOpen: false,
  title: '오류 발생',
  message: '',
  confirmText: '확인',
  onConfirm: undefined,
  showError: (
    message,
    title = '오류 발생',
    onConfirm,
    confirmText = '확인'
  ) => {
    set({ isOpen: true, message, title, onConfirm, confirmText });
  },
  closeError: () => set({ isOpen: false }), // 리다이렉트 중 깜빡임 방지를 위해 내용 보존
}));
