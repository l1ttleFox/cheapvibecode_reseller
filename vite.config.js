import { defineConfig } from 'vite';
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/relay.ai/' : '/',
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
}));
