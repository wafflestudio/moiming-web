import axios from 'axios';
import useAuthStore from '../hooks/useAuthStore';

// 공통 설정을 가진 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: '/api', // 모든 요청의 기본 경로
  timeout: 5000,
});

// 요청 인터셉터: 모든 요청 직전에 실행됨
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
