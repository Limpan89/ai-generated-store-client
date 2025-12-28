/**
 * Utility functions for Lighthouse testing
 */

import type { RunnerResult } from "lighthouse";

/**
 * Extract all scores from a Lighthouse result
 */
export function extractScores(result: RunnerResult) {
  return {
    performance: result.lhr.categories.performance?.score
      ? result.lhr.categories.performance.score * 100
      : 0,
    accessibility: result.lhr.categories.accessibility?.score
      ? result.lhr.categories.accessibility.score * 100
      : 0,
    bestPractices: result.lhr.categories["best-practices"]?.score
      ? result.lhr.categories["best-practices"].score * 100
      : 0,
    seo: result.lhr.categories.seo?.score
      ? result.lhr.categories.seo.score * 100
      : 0,
  };
}

/**
 * Extract Core Web Vitals from a Lighthouse result
 */
export function extractCoreWebVitals(result: RunnerResult) {
  const lcp = result.lhr.audits["largest-contentful-paint"];
  const fid = result.lhr.audits["max-potential-fid"];
  const cls = result.lhr.audits["cumulative-layout-shift"];

  return {
    lcp: lcp?.numericValue ? lcp.numericValue / 1000 : null, // Convert to seconds
    fid: fid?.numericValue ? fid.numericValue : null,
    cls: cls?.numericValue ? cls.numericValue : null,
  };
}

/**
 * Extract performance metrics from a Lighthouse result
 */
export function extractPerformanceMetrics(result: RunnerResult) {
  return {
    fcp: result.lhr.audits["first-contentful-paint"]?.numericValue
      ? result.lhr.audits["first-contentful-paint"].numericValue / 1000
      : null,
    si: result.lhr.audits["speed-index"]?.numericValue
      ? result.lhr.audits["speed-index"].numericValue / 1000
      : null,
    lcp: result.lhr.audits["largest-contentful-paint"]?.numericValue
      ? result.lhr.audits["largest-contentful-paint"].numericValue / 1000
      : null,
    tti: result.lhr.audits["interactive"]?.numericValue
      ? result.lhr.audits["interactive"].numericValue / 1000
      : null,
    tbt: result.lhr.audits["total-blocking-time"]?.numericValue
      ? result.lhr.audits["total-blocking-time"].numericValue
      : null,
    cls: result.lhr.audits["cumulative-layout-shift"]?.numericValue ?? null,
  };
}

/**
 * Get failed accessibility audits
 */
export function getFailedAccessibilityAudits(result: RunnerResult) {
  const a11yAudits = [
    "accesskeys",
    "aria-allowed-attr",
    "aria-required-attr",
    "aria-required-children",
    "aria-required-parent",
    "aria-roles",
    "aria-valid-attr",
    "aria-valid-attr-value",
    "button-name",
    "bypass",
    "color-contrast",
    "document-title",
    "duplicate-id-active",
    "duplicate-id-aria",
    "form-field-multiple-labels",
    "frame-title",
    "html-has-lang",
    "html-lang-valid",
    "image-alt",
    "input-image-alt",
    "label",
    "link-name",
    "list",
    "listitem",
    "meta-refresh",
    "meta-viewport",
    "object-alt",
    "tabindex",
    "td-headers-attr",
    "th-has-data-cells",
    "valid-lang",
    "video-caption",
  ];

  const failed: Array<{ id: string; title: string; description: string }> = [];

  a11yAudits.forEach((auditId) => {
    const audit = result.lhr.audits[auditId];
    if (audit && audit.score !== null && audit.score < 1) {
      failed.push({
        id: auditId,
        title: audit.title,
        description: audit.description,
      });
    }
  });

  return failed;
}

/**
 * Format scores for console output
 */
export function formatScoreReport(scores: ReturnType<typeof extractScores>) {
  const getEmoji = (score: number) => {
    if (score >= 90) return "🟢";
    if (score >= 50) return "🟠";
    return "🔴";
  };

  return `
╔════════════════════════════════════╗
║      Lighthouse Audit Scores       ║
╠════════════════════════════════════╣
║ ${getEmoji(scores.performance)} Performance:    ${scores.performance
    .toFixed(0)
    .padStart(3)}      ║
║ ${getEmoji(scores.accessibility)} Accessibility:  ${scores.accessibility
    .toFixed(0)
    .padStart(3)}      ║
║ ${getEmoji(scores.bestPractices)} Best Practices: ${scores.bestPractices
    .toFixed(0)
    .padStart(3)}      ║
║ ${getEmoji(scores.seo)} SEO:             ${scores.seo
    .toFixed(0)
    .padStart(3)}      ║
╚════════════════════════════════════╝
`;
}

/**
 * Check if server is ready
 */
export async function waitForServer(
  url: string,
  timeout = 30000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}
