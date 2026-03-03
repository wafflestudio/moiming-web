import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef } from 'react';
import useAuthStore from './useAuthStore';
import { useErrorStore } from './useErrorStore';

// 5분 버퍼 (밀리초) -> 만료 5분 전에 미리 로그아웃 시킴
const BUFFER_TIME = 5 * 60 * 1000;

export function useAutoLogout() {
  const { token, logout } = useAuthStore();
  const showError = useErrorStore((state) => state.showError);

  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!token) {
      isLoggingOut.current = false;
      return;
    }

    const checkAndLogout = () => {
      if (isLoggingOut.current) return;

      try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return;

        // 토큰 exp는 초 단위이므로 밀리초로 변환
        const expTimeMs = decoded.exp * 1000;
        const now = Date.now();

        // (만료시간 - 버퍼) 시점까지 남은 시간
        const timeLeftToLogout = expTimeMs - BUFFER_TIME - now;

        if (timeLeftToLogout <= 0) {
          // 이미 만료 시점을(혹은 버퍼 시점을) 지났다면 즉시 로그아웃
          handleLogout();
        } else {
          // 아직 시간이 남았다면 타이머 설정
          const timerId = setTimeout(() => {
            handleLogout();
          }, timeLeftToLogout);

          return timerId;
        }
      } catch (error) {
        // 토큰 디코딩 실패 시 (유효하지 않은 토큰) 강제 로그아웃
        console.error('Invalid token format', error);
        handleLogout();
      }
    };

    const handleLogout = () => {
      if (isLoggingOut.current) return;
      isLoggingOut.current = true;

      logout();
      showError(
        '로그인 유지 시간이 만료되어 자동으로 로그아웃되었습니다.',
        '로그아웃 안내',
        () => {
          window.location.href = '/login';
        },
        '다시 로그인하기'
      );
    };

    // 1. 마운트 시점에 체크 & 타이머 설정
    let timerId = checkAndLogout();

    // 2. 브라우저 탭 활성화(포커스 복귀) 시점에 다시 체크
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (timerId) clearTimeout(timerId);
        timerId = checkAndLogout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, logout, showError]);
}
