/**
 * Vitest configuration for Lighthouse tests
 * Separate config to avoid conflicts with unit tests
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["lighthouse/**/*.test.ts"],
    testTimeout: 90000, // Lighthouse tests can take longer
    hookTimeout: 30000,
  },
});
