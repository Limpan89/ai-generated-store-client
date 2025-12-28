/**
 * Vitest configuration for unit tests
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    exclude: ["**/node_modules/**", "**/e2e/**", "**/lighthouse/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "**/node_modules/**",
        "**/e2e/**",
        "**/lighthouse/**",
        "**/*.config.*",
        "**/*.d.ts",
        "**/dist/**",
        "**/__tests__/**",
        "**/setupTests.ts",
        "**/vite-env.d.ts",
        "**/css-modules.d.ts",
      ],
      include: ["src/**/*.{ts,tsx}"],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
});
