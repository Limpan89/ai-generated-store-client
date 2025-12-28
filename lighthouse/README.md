# Lighthouse Tests

This directory contains Lighthouse-based interface tests for performance, accessibility, best practices, and SEO auditing.

## Prerequisites

Before running Lighthouse tests, you need:

1. A running development server on `http://localhost:5173`
2. Chrome/Chromium installed on your system

## Running the Tests

### Start the dev server first:

```bash
npm run dev
```

### In a separate terminal, run Lighthouse tests:

```bash
# Run all Lighthouse tests
npm run test:lighthouse

# Run Lighthouse tests in watch mode
npm run test:lighthouse:watch
```

## Test Files

### `lighthouse.test.ts`

Main Lighthouse audit tests that check overall scores for:

- **Performance** (threshold: 70)
- **Accessibility** (threshold: 85)
- **Best Practices** (threshold: 80)
- **SEO** (threshold: 80)

Tests multiple pages including home and product detail pages.

### `lighthouse-detailed.test.ts`

Detailed metric tests that check specific Core Web Vitals and performance metrics:

- **First Contentful Paint (FCP)** - Should be under 2 seconds
- **Largest Contentful Paint (LCP)** - Should be under 2.5 seconds (Core Web Vital)
- **Cumulative Layout Shift (CLS)** - Should be under 0.1 (Core Web Vital)
- **Total Blocking Time (TBT)** - Should be under 300ms
- **Speed Index** - Should be under 3.4 seconds
- **Accessibility audits** - Checks for common a11y issues
- **Image optimization** - Verifies proper image handling

## Adjusting Thresholds

You can adjust the score thresholds in each test file by modifying the `THRESHOLDS` constant:

```typescript
const THRESHOLDS = {
  performance: 70,
  accessibility: 85,
  "best-practices": 80,
  seo: 80,
};
```

## Viewing Detailed Reports

The tests output scores and key metrics to the console. For more detailed analysis:

1. Run Lighthouse manually via Chrome DevTools
2. Use the Lighthouse CLI: `npx lighthouse http://localhost:5173 --view`
3. Integrate with CI/CD for automated reporting

## Common Issues

### "Connection refused" or "Target closed"

- Make sure the dev server is running on port 5173
- Check that no firewall is blocking localhost connections

### Tests timing out

- Increase timeout values in `vitest.lighthouse.config.ts`
- Check system resources (Lighthouse is resource-intensive)

### Low scores

- Review the specific audit failures in console output
- Check network throttling settings in `lighthouse.config.js`
- Optimize images, reduce bundle size, improve accessibility

## Integration with CI/CD

To run Lighthouse tests in CI:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm ci

- name: Build app
  run: npm run build

- name: Start server
  run: npm run preview &

- name: Wait for server
  run: npx wait-on http://localhost:5173

- name: Run Lighthouse tests
  run: npm run test:lighthouse
```

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
