import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environmentMatchGlobs: [
      ['src/tests/e2e/**/*.spec.ts', 'prisma']
    ]
  }
})
