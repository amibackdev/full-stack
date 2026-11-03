import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Прокси на /api, а НЕ на /task, /tasks, /uploads, как было в ТЗ:
// клиентский маршрут /task/:id совпал бы с префиксом /task, и при F5 на странице задачи
// dev-сервер отдал бы JSON с бэкенда вместо index.html. /api выбран, чтобы маршруты не пересекались.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.DEV_BACKEND_URL || 'http://localhost:5000';
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { target, changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      },
    },
    build: {
      rollupOptions: {
        output: { manualChunks: { three: ['three'] } },
      },
    },
  };
});
