import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element not found');
}

async function enableMocking() {
  // MSW 비활성화 시 return; 주석 제거
  // return;

  // 개발 환경일 때만 MSW를 실행
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 5분 동안은 신선하다고 간주하여 불필요한 재요청 방지
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error: unknown) => {
        // 인증 관련 에러는 재시도하지 않음
        if (error instanceof Error) {
          if (
            error.message === 'TOKEN_EXPIRED_LOCAL' ||
            error.message === 'INVALID_TOKEN_FORMAT'
          ) {
            return false;
          }
        }

        if (axios.isAxiosError(error)) {
          if (
            error.response?.status === 401 ||
            error.response?.data?.code === 'TOKEN_EXPIRED'
          ) {
            return false;
          }
        }

        // 그 외 에러는 기본값(3번) 재시도
        return failureCount < 3;
      },
    },
  },
});

enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* 개발 도구 추가 (개발 환경에서만 보임) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
});
