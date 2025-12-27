import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3003,
      host: '0.0.0.0',
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          app: path.resolve(__dirname, 'app.html'),
        },
      },
    },
    define: {
      // Local AI environment variables
      'process.env.AI_PROVIDER': JSON.stringify(env.AI_PROVIDER),
      'process.env.OLLAMA_BASE_URL': JSON.stringify(env.OLLAMA_BASE_URL),
      'process.env.OLLAMA_MODEL': JSON.stringify(env.OLLAMA_MODEL),
      'process.env.LMSTUDIO_BASE_URL': JSON.stringify(env.LMSTUDIO_BASE_URL),
      'process.env.LMSTUDIO_MODEL': JSON.stringify(env.LMSTUDIO_MODEL),
      'process.env.HF_API_KEY': JSON.stringify(env.HF_API_KEY),
      'process.env.HF_BASE_URL': JSON.stringify(env.HF_BASE_URL),
      'process.env.HF_MODEL': JSON.stringify(env.HF_MODEL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
