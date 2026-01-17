import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

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
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
    }
  )
);

export default useAuthStore;
