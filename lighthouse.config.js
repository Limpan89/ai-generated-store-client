/**
 * Lighthouse configuration for performance and accessibility testing
 */

export default {
  extends: "lighthouse:default",
  settings: {
    // Run tests on desktop
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
    // Only run specific categories
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  },
};
