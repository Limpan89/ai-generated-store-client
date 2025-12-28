/**
 * Lighthouse tests for performance, accessibility, and best practices
 * Run these tests against a live development server
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import type { RunnerResult } from "lighthouse";
import type { LaunchedChrome } from "chrome-launcher";

const APP_URL = "http://localhost:5173";

// Minimum scores for each category
// Note: These are adjusted for dev server testing
// For production testing, use higher thresholds (performance: 70+)
const THRESHOLDS = {
  performance: 55, // Dev server is slower due to HMR and unoptimized assets
  accessibility: 85,
  "best-practices": 80,
  seo: 80,
};

describe("Lighthouse Audits", () => {
  let chrome: LaunchedChrome;

  beforeAll(async () => {
    // Launch Chrome
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--disable-gpu", "--no-sandbox"],
    });
  }, 30000);

  afterAll(async () => {
    if (chrome) {
      await chrome.kill();
    }
  });

  it("should meet performance thresholds on home page", async () => {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["performance"],
      port: chrome.port,
    };

    const runnerResult = (await lighthouse(APP_URL, options)) as
      | RunnerResult
      | undefined;

    expect(runnerResult).toBeDefined();
    const score = runnerResult!.lhr.categories.performance.score! * 100;

    console.log(`Performance Score: ${score}`);
    expect(score).toBeGreaterThanOrEqual(THRESHOLDS.performance);
  }, 60000);

  it("should meet accessibility thresholds on home page", async () => {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["accessibility"],
      port: chrome.port,
    };

    const runnerResult = (await lighthouse(APP_URL, options)) as
      | RunnerResult
      | undefined;

    expect(runnerResult).toBeDefined();
    const score = runnerResult!.lhr.categories.accessibility.score! * 100;

    console.log(`Accessibility Score: ${score}`);
    expect(score).toBeGreaterThanOrEqual(THRESHOLDS.accessibility);
  }, 60000);

  it("should meet best practices thresholds on home page", async () => {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["best-practices"],
      port: chrome.port,
    };

    const runnerResult = (await lighthouse(APP_URL, options)) as
      | RunnerResult
      | undefined;

    expect(runnerResult).toBeDefined();
    const score = runnerResult!.lhr.categories["best-practices"].score! * 100;

    console.log(`Best Practices Score: ${score}`);
    expect(score).toBeGreaterThanOrEqual(THRESHOLDS["best-practices"]);
  }, 60000);

  it("should meet SEO thresholds on home page", async () => {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["seo"],
      port: chrome.port,
    };

    const runnerResult = (await lighthouse(APP_URL, options)) as
      | RunnerResult
      | undefined;

    expect(runnerResult).toBeDefined();
    const score = runnerResult!.lhr.categories.seo.score! * 100;

    console.log(`SEO Score: ${score}`);
    expect(score).toBeGreaterThanOrEqual(THRESHOLDS.seo);
  }, 60000);

  it("should audit product detail page", async () => {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["performance", "accessibility"],
      port: chrome.port,
    };

    // Test a specific product page
    const runnerResult = (await lighthouse(`${APP_URL}/product/1`, options)) as
      | RunnerResult
      | undefined;

    expect(runnerResult).toBeDefined();
    const perfScore = runnerResult!.lhr.categories.performance.score! * 100;
    const a11yScore = runnerResult!.lhr.categories.accessibility.score! * 100;

    console.log(`Product Page - Performance: ${perfScore}, A11y: ${a11yScore}`);

    expect(perfScore).toBeGreaterThanOrEqual(THRESHOLDS.performance);
    expect(a11yScore).toBeGreaterThanOrEqual(THRESHOLDS.accessibility);
  }, 60000);

  it("should generate comprehensive report for home page", async () => {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      port: chrome.port,
    };

    const runnerResult = (await lighthouse(APP_URL, options)) as
      | RunnerResult
      | undefined;

    expect(runnerResult).toBeDefined();

    const scores = {
      performance: runnerResult!.lhr.categories.performance.score! * 100,
      accessibility: runnerResult!.lhr.categories.accessibility.score! * 100,
      bestPractices:
        runnerResult!.lhr.categories["best-practices"].score! * 100,
      seo: runnerResult!.lhr.categories.seo.score! * 100,
    };

    console.log("\n=== Lighthouse Audit Summary ===");
    console.log(`Performance:    ${scores.performance.toFixed(0)}`);
    console.log(`Accessibility:  ${scores.accessibility.toFixed(0)}`);
    console.log(`Best Practices: ${scores.bestPractices.toFixed(0)}`);
    console.log(`SEO:            ${scores.seo.toFixed(0)}`);
    console.log("================================\n");

    // All scores should meet thresholds
    expect(scores.performance).toBeGreaterThanOrEqual(THRESHOLDS.performance);
    expect(scores.accessibility).toBeGreaterThanOrEqual(
      THRESHOLDS.accessibility
    );
    expect(scores.bestPractices).toBeGreaterThanOrEqual(
      THRESHOLDS["best-practices"]
    );
    expect(scores.seo).toBeGreaterThanOrEqual(THRESHOLDS.seo);
  }, 90000);
});
