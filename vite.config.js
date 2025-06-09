import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente com base no modo (dev/prod)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Configuração base para o deploy
    base: mode === 'production' ? '/' : '/',
    // Define variáveis de ambiente para o cliente
    define: {
      'process.env': {},
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:8000')
    },
    // Configurações específicas para o build de produção
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // Garante que os arquivos de saída tenham hashes no nome para cache
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`
        }
      },
      // Tamanho máximo para avisos de bundle (em kBs)
      chunkSizeWarningLimit: 1000,
    },
    // Configuração do servidor de desenvolvimento
    server: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
    // Configuração para o modo de preview
    preview: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
      open: true,
    },
    // Otimizações para produção
    optimizeDeps: {
      include: ['@mui/material', '@emotion/react', '@emotion/styled'],
    },
  };
});
