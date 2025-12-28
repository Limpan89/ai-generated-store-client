/**
 * Example Lighthouse test with detailed reporting
 * Uses utility functions for cleaner test code
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import type { RunnerResult } from "lighthouse";
import type { LaunchedChrome } from "chrome-launcher";
import {
  extractScores,
  extractPerformanceMetrics,
  extractCoreWebVitals,
  getFailedAccessibilityAudits,
  formatScoreReport,
} from "./utils";

const APP_URL = "http://localhost:5173";

describe("Lighthouse Example Tests", () => {
  let chrome: LaunchedChrome;

  beforeAll(async () => {
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--disable-gpu", "--no-sandbox"],
    });
  }, 30000);

  afterAll(async () => {
    if (chrome) {
      await chrome.kill();
    }
  });

  it("should generate a comprehensive audit report", async () => {
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

    // Extract and display all scores
    const scores = extractScores(runnerResult!);
    console.log(formatScoreReport(scores));

    // Extract and display Core Web Vitals
    const cwv = extractCoreWebVitals(runnerResult!);
    console.log("\n📊 Core Web Vitals:");
    console.log(`   LCP: ${cwv.lcp?.toFixed(2)}s (target: < 2.5s)`);
    console.log(`   CLS: ${cwv.cls?.toFixed(3)} (target: < 0.1)`);

    // Extract and display performance metrics
    const metrics = extractPerformanceMetrics(runnerResult!);
    console.log("\n⚡ Performance Metrics:");
    console.log(`   FCP: ${metrics.fcp?.toFixed(2)}s`);
    console.log(`   SI:  ${metrics.si?.toFixed(2)}s`);
    console.log(`   TTI: ${metrics.tti?.toFixed(2)}s`);
    console.log(`   TBT: ${metrics.tbt?.toFixed(0)}ms`);

    // Check for accessibility issues
    const a11yIssues = getFailedAccessibilityAudits(runnerResult!);
    if (a11yIssues.length > 0) {
      console.log("\n♿ Accessibility Issues:");
      a11yIssues.forEach((issue) => {
        console.log(`   ❌ ${issue.id}: ${issue.title}`);
      });
    } else {
      console.log("\n♿ Accessibility: All audits passed! ✓");
    }

    // Basic assertions
    expect(scores.performance).toBeGreaterThan(0);
    expect(scores.accessibility).toBeGreaterThan(0);
    expect(scores.bestPractices).toBeGreaterThan(0);
    expect(scores.seo).toBeGreaterThan(0);
  }, 90000);

  it("should verify Core Web Vitals are within acceptable ranges", async () => {
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

    const cwv = extractCoreWebVitals(runnerResult!);

    // Core Web Vitals thresholds (adjusted for dev server)
    if (cwv.lcp) {
      console.log(`LCP: ${cwv.lcp.toFixed(2)}s`);
      expect(cwv.lcp).toBeLessThan(12.0); // "Good" is < 2.5s, dev allows up to 12s
    }

    if (cwv.cls) {
      console.log(`CLS: ${cwv.cls.toFixed(3)}`);
      expect(cwv.cls).toBeLessThan(0.25); // "Good" is < 0.1, we allow up to 0.25
    }
  }, 60000);

  it("should audit multiple pages", async () => {
    const pages = [
      { name: "Home", url: APP_URL },
      { name: "Register", url: `${APP_URL}/register` },
      { name: "Product Detail", url: `${APP_URL}/product/1` },
    ];

    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: ["performance", "accessibility"],
      port: chrome.port,
    };

    console.log("\n🔍 Auditing multiple pages...\n");

    for (const page of pages) {
      const runnerResult = (await lighthouse(page.url, options)) as
        | RunnerResult
        | undefined;

      expect(runnerResult).toBeDefined();

      const scores = extractScores(runnerResult!);
      console.log(`${page.name}:`);
      console.log(`  Performance:    ${scores.performance.toFixed(0)}`);
      console.log(`  Accessibility:  ${scores.accessibility.toFixed(0)}`);

      // All pages should have reasonable scores
      expect(scores.performance).toBeGreaterThan(40);
      expect(scores.accessibility).toBeGreaterThan(70);
    }
  }, 180000);
});
