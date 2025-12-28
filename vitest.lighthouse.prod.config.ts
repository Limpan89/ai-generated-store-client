/**
 * Vitest configuration for Lighthouse tests against PRODUCTION build
 * Test against preview server (http://localhost:4173) after building
 * Run with: npm run test:lighthouse:prod
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["lighthouse/**/*.test.ts"],
    testTimeout: 90000,
    hookTimeout: 30000,
    // Override APP_URL for production testing
    env: {
      APP_URL: "http://localhost:4173",
    },
  },
});
