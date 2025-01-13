import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'dev') {
    return {
      plugins: [
        react({
          jsxImportSource: '@emotion/react',
          tsDecorators: true,
        }),
        tsconfigPaths(),
      ],
      server: {
        port: 5100,
      },
    };
  }
  return {
    base: './',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        tsDecorators: true,
      }),
      tsconfigPaths(),
    ],
  };
});
