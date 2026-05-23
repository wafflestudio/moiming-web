import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import useAuthStore from '../hooks/useAuthStore';
import { useErrorStore } from '../hooks/useErrorStore';

interface ApiErrorResponse {
  code: string;
  title: string;
  message: string;
}

const TIMEOUT = 10 * 1000; // 10sec
const BUFFER_TIME = 5 * 60 * 1000; // 5min

// 공통 설정을 가진 axios 인스턴스 생성
const apiClient = axios.create({
  // Use proxy in dev mode
  baseURL: import.meta.env.DEV
    ? '/api'
    : `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// 토큰 만료 시 동시 다발적 API 요청을 막기 위한 플래그
let isTokenExpiredLocal = false;

// 요청 인터셉터: 모든 요청 직전에 실행됨
apiClient.interceptors.request.use((config) => {
  if (isTokenExpiredLocal) {
    return Promise.reject(new Error('TOKEN_EXPIRED_LOCAL'));
  }

  const { token, logout } = useAuthStore.getState();

  if (token) {
    try {
      const decoded = jwtDecode(token);

      if (decoded.exp) {
        const expTimeMs = decoded.exp * 1000;
        const now = Date.now();

        // 만료시간 5분 전(혹은 이미 지남)이면 거부
        if (expTimeMs - BUFFER_TIME - now <= 0) {
          isTokenExpiredLocal = true;
          // 1초 후 플래그 해제 (일시적 차단)
          setTimeout(() => {
            isTokenExpiredLocal = false;
          }, 1000);

          // 상태 관리 로그아웃 처리만 수행
          // 에러 모달(showError)과 리다이렉트(window.location.href)는 응답 인터셉터에서 일괄 처리
          logout();
          return Promise.reject(new Error('TOKEN_EXPIRED_LOCAL'));
        }
      }
    } catch {
      // 디코딩 실패 시 진행하지 않음 (서버가 거절하도록 두거나 여기서 바로 막음)
      // 보안상 여기서 바로 막는 것이 안전
      logout();
      return Promise.reject(new Error('INVALID_TOKEN_FORMAT'));
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const showError = useErrorStore.getState().showError;

    // 1. 로컬에서 발생시킨 토큰 만료 에러인 경우 useAutoLogout과 동일한 모달을 띄우고 reject
    if (
      error.message === 'TOKEN_EXPIRED_LOCAL' ||
      error.message === 'INVALID_TOKEN_FORMAT'
    ) {
      showError(
        '로그인 유지 시간이 만료되어 자동으로 로그아웃되었습니다.',
        '로그아웃 안내',
        () => {
          window.location.href = '/login';
        },
        '다시 로그인하기',
        '취소'
      );
      return Promise.reject(error);
    }

    if (error.response?.data) {
      const { title, message, code } = error.response.data;

      // 2. 토큰 만료 등 특수한 경우 확인 버튼 액션 정의
      let onConfirm = undefined;
      let confirmText = undefined;
      let cancelText = undefined;
      if (code === 'TOKEN_EXPIRED') {
        onConfirm = () => {
          window.location.href = '/login';
        };
        confirmText = '다시 로그인하기';
        cancelText = '취소';
      }

      // 3. 스토어를 통해 모달 띄우기 (순서 주의: message, title, onConfirm, confirmText, cancelText, onCancel)
      showError(message, title || '오류 발생', onConfirm, confirmText, cancelText);
    } else {
      // 서버 응답 자체가 없는 경우 (네트워크 오류 등)
      showError(
        '서버와 연결할 수 없습니다. 다시 시도해 주세요.',
        '네트워크 오류'
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
