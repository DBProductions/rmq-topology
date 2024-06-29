import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.exclude,
        'output/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'public/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'src/examples.js',
        'src/listener.js',
        'src/main.js',
        'index.js'
      ],
    }
  }
})
