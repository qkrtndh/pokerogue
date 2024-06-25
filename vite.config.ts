import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export const defaultConfig = {
  plugins: [tsconfigPaths()],
  server: { host: '0.0.0.0', port: 8000 },
  clearScreen: false,
  build: {
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 임계값 설정
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // node_modules 폴더의 모든 라이브러리를 vendor 청크로 분리
          }
          if (id.includes('src/system')) {
            return 'system'; // src/system 폴더의 모든 파일을 system 청크로 분리
          }
          if (id.includes('src/ui')) {
            return 'ui'; // src/ui 폴더의 모든 파일을 ui 청크로 분리
          }
        },
      },
      onwarn(warning, warn) {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
};

export default defineConfig(({ mode }) => ({
  ...defaultConfig,
  esbuild: {
    pure: mode === 'production' ? ['console.log'] : [],
    keepNames: true,
  },
}));
