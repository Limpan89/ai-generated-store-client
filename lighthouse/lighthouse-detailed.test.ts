/**
 * Detailed Lighthouse tests with specific metric checks
 * Tests Core Web Vitals and other key performance metrics
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import type { RunnerResult } from "lighthouse";
import type { LaunchedChrome } from "chrome-launcher";

const APP_URL = "http://localhost:5173";

describe("Lighthouse Detailed Metrics", () => {
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

  it("should have acceptable First Contentful Paint (FCP)", async () => {
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
    const fcpMetric = runnerResult!.lhr.audits["first-contentful-paint"];
    const fcpValue = fcpMetric.numericValue! / 1000; // Convert to seconds

    console.log(`First Contentful Paint: ${fcpValue.toFixed(2)}s`);

    // FCP should be under 7 seconds for dev server (2s for production)
    expect(fcpValue).toBeLessThan(7.0);
  }, 60000);

  it("should have acceptable Largest Contentful Paint (LCP)", async () => {
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
    const lcpMetric = runnerResult!.lhr.audits["largest-contentful-paint"];
    const lcpValue = lcpMetric.numericValue! / 1000;

    console.log(`Largest Contentful Paint: ${lcpValue.toFixed(2)}s`);

    // LCP should be under 12 seconds for dev server (2.5s for production - Core Web Vital)
    expect(lcpValue).toBeLessThan(12.0);
  }, 60000);

  it("should have acceptable Cumulative Layout Shift (CLS)", async () => {
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
    const clsMetric = runnerResult!.lhr.audits["cumulative-layout-shift"];
    const clsValue = clsMetric.numericValue!;

    console.log(`Cumulative Layout Shift: ${clsValue.toFixed(3)}`);

    // CLS should be under 0.1 (Core Web Vital)
    expect(clsValue).toBeLessThan(0.1);
  }, 60000);

  it("should have acceptable Total Blocking Time (TBT)", async () => {
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
    const tbtMetric = runnerResult!.lhr.audits["total-blocking-time"];
    const tbtValue = tbtMetric.numericValue!;

    console.log(`Total Blocking Time: ${tbtValue.toFixed(0)}ms`);

    // TBT should be under 300ms for good UX
    expect(tbtValue).toBeLessThan(300);
  }, 60000);

  it("should have acceptable Speed Index", async () => {
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
    const siMetric = runnerResult!.lhr.audits["speed-index"];
    const siValue = siMetric.numericValue! / 1000;

    console.log(`Speed Index: ${siValue.toFixed(2)}s`);

    // Speed Index should be under 7 seconds for dev server (3.4s for production)
    expect(siValue).toBeLessThan(7.0);
  }, 60000);

  it("should check accessibility issues", async () => {
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

    // Check for common accessibility audits
    const a11yAudits = [
      "aria-allowed-attr",
      "aria-required-attr",
      "button-name",
      "color-contrast",
      "document-title",
      "html-has-lang",
      "image-alt",
      "label",
      "link-name",
    ];

    const failedAudits: string[] = [];

    a11yAudits.forEach((auditId) => {
      const audit = runnerResult!.lhr.audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        failedAudits.push(auditId);
        console.log(`❌ Failed: ${auditId} (${audit.title})`);
      }
    });

    if (failedAudits.length > 0) {
      console.log(`\nFailed accessibility audits: ${failedAudits.join(", ")}`);
    }

    // Should have minimal accessibility issues
    expect(failedAudits.length).toBeLessThanOrEqual(2);
  }, 60000);

  it("should have optimal image optimization", async () => {
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

    // Check various image optimization audits
    const imageAudits = [
      "modern-image-formats",
      "uses-optimized-images",
      "uses-responsive-images",
    ];

    imageAudits.forEach((auditId) => {
      const audit = runnerResult!.lhr.audits[auditId];
      if (audit && audit.score !== null) {
        console.log(
          `${auditId}: ${audit.score === 1 ? "✓" : "⚠"} (score: ${audit.score})`
        );
      }
    });

    // At least one image optimization should be passing
    const passingAudits = imageAudits.filter(
      (id) => runnerResult!.lhr.audits[id]?.score === 1
    );
    expect(passingAudits.length).toBeGreaterThan(0);
  }, 60000);
});
