import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_TARGET = env.VITE_API_BASE_URL;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.info('-→', req.method, req.url);
              proxyReq.removeHeader('origin'); // 서버에서 내려오는 CORS 에러 방지
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.info('←-', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  };
});
