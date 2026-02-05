import axios, { AxiosError } from 'axios';
import useAuthStore from '../hooks/useAuthStore';
import { useErrorStore } from '../hooks/useErrorStore';

interface ApiErrorResponse {
  code: string;
  title: string;
  message: string;
}

// 공통 설정을 가진 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: 모든 요청 직전에 실행됨
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
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
      if (code === 'TOKEN_EXPIRED') {
        onConfirm = () => {
          window.location.href = '/login';
        };
      }

      // 2. 스토어를 통해 모달 띄우기 (순서 주의: message, title, onConfirm)
      showError(message, title || '오류 발생', onConfirm);
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
