import type { User } from '@/types/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  // 로그인 시 유저 정보와 토큰을 함께 저장
  login: (user: User, token: string) => void;
  // 로그아웃 시 상태 초기화
  logout: () => void;
  // 유저 정보만 업데이트하는 액션
  updateUser: (user: User) => void;
  // 비로그인 신청 정보 관리 (key: eventPublicId, value: registrationId)
  guestRegistrations: Record<string, string>;
  // 비로그인 신청 정보를 저장하는 액션
  setGuestRegistration: (eventId: string, registrationId: string) => void;
  // 신청 취소 시 정보를 삭제하는 액션
  removeGuestRegistration: (eventId: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      guestRegistrations: {},

      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      updateUser: (user) => set({ user }),
      setGuestRegistration: (eventId, registrationId) =>
        set((state) => ({
          guestRegistrations: {
            ...state.guestRegistrations,
            [eventId]: registrationId,
          },
        })),

      removeGuestRegistration: (eventId) =>
        set((state) => {
          if (!eventId || !state.guestRegistrations) return state;
          if (!(eventId in state.guestRegistrations)) return state;
          
          const newRegistrations = { ...state.guestRegistrations };
          delete newRegistrations[eventId];
          return { guestRegistrations: newRegistrations };
        }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
    }
  )
);

export default useAuthStore;
