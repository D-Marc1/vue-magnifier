// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite'
// eslint-disable-next-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  root: 'demo',
  build: {
    lib: {
      entry: resolve(__dirname, './src/install.ts'),
      name: 'VueMagnifier',
      fileName: (format) => `vue-magnifier.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', '@/css/style.css'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
