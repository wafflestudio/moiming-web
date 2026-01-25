// 핸들러 주소를 생성해주는 간단한 헬퍼 함수
export const path = (endpoint: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}/api/v1${endpoint}`;
};
