import { useEffect } from 'react';
import useAuthStore from './useAuthStore';
import { useErrorStore } from './useErrorStore';

// 22시간 (밀리초)
const EXPIRY_TIME = 22 * 60 * 60 * 1000;

export function useAutoLogout() {
  const { token, tokenIssuedAt, logout } = useAuthStore();
  const showError = useErrorStore((state) => state.showError);

  useEffect(() => {
    // 토큰이 없거나 발급 시간이 없으면 검사하지 않음
    if (!token || !tokenIssuedAt) return;

    const checkAndLogout = () => {
      const timeElapsed = Date.now() - tokenIssuedAt;
      const timeLeft = EXPIRY_TIME - timeElapsed;

      if (timeLeft <= 0) {
        // 이미 만료된 경우 즉시 로그아웃
        handleLogout();
      } else {
        // 아직 만료되지 않았다면 남은 시간 뒤에 로그아웃 하도록 타이머 설정
        const timerId = setTimeout(() => {
          handleLogout();
        }, timeLeft);

        return timerId;
      }
    };

    const handleLogout = () => {
      logout();
      showError(
        '세션이 만료되어 자동으로 로그아웃 되었습니다. 다시 로그인해 주세요.',
        '로그아웃 안내',
        () => {
          window.location.href = '/login';
        }
      );
    };

    // 1. 마운트 시점에 체크 & 타이머 설정
    let timerId = checkAndLogout();

    // 2. 브라우저 탭 활성화(포커스 복귀) 시점에 다시 체크
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 기존 타이머 클리어 후 재계산
        if (timerId) clearTimeout(timerId);
        timerId = checkAndLogout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, tokenIssuedAt, logout, showError]);
}
