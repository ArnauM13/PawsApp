import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts']
  },
  resolve: {
    alias: [
      { find: '@shared', replacement: '/src/app/shared' },
      { find: '@core', replacement: '/src/app/core' },
      { find: '@core/config', replacement: '/src/app/core/config/index' },
      { find: '@features', replacement: '/src/app/features' },
      { find: '@features/pets', replacement: '/src/app/features/pets' }
    ]
  }
});
