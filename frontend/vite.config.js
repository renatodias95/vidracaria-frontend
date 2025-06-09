import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Configuração para o modo de preview
  preview: {
    port: 3000,
    open: true,
  },
  // Define variáveis de ambiente para o cliente
  define: {
    'process.env': {}
  },
  // Otimizações para produção
  optimizeDeps: {
    include: ['@mui/material', '@emotion/react', '@emotion/styled'],
  },
});
