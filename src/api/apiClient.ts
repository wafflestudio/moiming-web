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
const BUFFER_TIME = 10 * 60 * 1000; // 10min

// 공통 설정을 가진 axios 인스턴스 생성
const apiClient = axios.create({
  // Use proxy in dev mode
  baseURL: import.meta.env.DEV
    ? '/api'
    : `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: 모든 요청 직전에 실행됨
apiClient.interceptors.request.use((config) => {
  const { token, logout } = useAuthStore.getState();

  if (token) {
    try {
      const decoded = jwtDecode(token);

      if (decoded.exp) {
        const expTimeMs = decoded.exp * 1000;
        const now = Date.now();

        // 만료시간 5분 전(혹은 이미 지남)이면 거부
        if (expTimeMs - BUFFER_TIME - now <= 0) {
          // 상태 관리 로그아웃 처리만 수행
          // 에러 모달(showError)과 리다이렉트(window.location.href)는
          // 최상단 App.tsx에 마운트된 useAutoLogout 훅에서 일괄적으로 처리하도록 위임함.
          // 여기서 중복 호출 시 모달이 2번 뜨는 Race Condition 발생 가능성 차단
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

    if (error.response?.data) {
      const { title, message, code } = error.response.data;

      // 1. 토큰 만료 등 특수한 경우 확인 버튼 액션 정의
      let onConfirm = undefined;
      let confirmText = undefined;
      if (code === 'TOKEN_EXPIRED') {
        onConfirm = () => {
          window.location.href = '/login';
        };
        confirmText = '다시 로그인하기';
      }

      // 2. 스토어를 통해 모달 띄우기 (순서 주의: message, title, onConfirm, confirmText)
      showError(message, title || '오류 발생', onConfirm, confirmText);
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
