# Lighthouse Testing Quick Start Guide

## What is Lighthouse?

Lighthouse is an automated tool from Google that audits web applications for:

- ⚡ **Performance** - Load times, responsiveness, visual stability
- ♿ **Accessibility** - WCAG compliance, screen reader support, keyboard navigation
- ✅ **Best Practices** - Security, modern web standards, console errors
- 🔍 **SEO** - Meta tags, mobile-friendliness, structured data

## Installation

Already installed! The following packages were added:

- `lighthouse` - The core auditing engine
- `chrome-launcher` - Launches Chrome for testing

## Running Tests

### Step 1: Start your dev server

```bash
npm run dev
```

This starts the app at `http://localhost:5173`

### Step 2: Run Lighthouse tests (in a new terminal)

```bash
# Run all Lighthouse tests once
npm run test:lighthouse

# Run in watch mode (auto-rerun on changes)
npm run test:lighthouse:watch
```

## Test Files Overview

### 📄 `lighthouse.test.ts` - Overall Score Tests

Tests that your app meets minimum score thresholds:

- Performance ≥ 70
- Accessibility ≥ 85
- Best Practices ≥ 80
- SEO ≥ 80

**Use this for:** CI/CD gates, overall quality checks

### 📄 `lighthouse-detailed.test.ts` - Metric-Specific Tests

Tests individual performance and accessibility metrics:

- First Contentful Paint (FCP) < 2s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 300ms
- Speed Index < 3.4s

**Use this for:** Performance debugging, optimization validation

### 📄 `lighthouse-example.test.ts` - Example with Utilities

Demonstrates using helper functions for custom reporting and multi-page audits.

**Use this for:** Learning, custom test creation

## Understanding Results

### Score Ranges

- **90-100** 🟢 Good - Excellent performance/quality
- **50-89** 🟠 Needs Improvement - Address issues
- **0-49** 🔴 Poor - Critical issues need fixing

### Core Web Vitals (CWV)

Google's key user experience metrics:

- **LCP** (Largest Contentful Paint): Main content load time
- **FID** (First Input Delay): Interactivity responsiveness
- **CLS** (Cumulative Layout Shift): Visual stability

## Common Scenarios

### ✅ All Tests Pass

Great! Your app meets quality standards. Consider:

- Running tests in CI/CD
- Setting up performance budgets
- Monitoring scores over time

### ❌ Performance Tests Fail

Check:

- Bundle size (use `npm run build` and check dist/ folder)
- Image optimization (compress, use modern formats)
- Code splitting (lazy load routes/components)
- Third-party scripts (defer non-critical)

### ❌ Accessibility Tests Fail

Check:

- Color contrast ratios
- Alt text on images
- Form labels
- Keyboard navigation
- ARIA attributes

### ❌ SEO Tests Fail

Check:

- Document title and meta description
- Meta viewport tag
- Heading hierarchy (h1, h2, etc.)
- Robots.txt and sitemap

## Customizing Tests

### Adjust Score Thresholds

Edit the `THRESHOLDS` object in test files:

```typescript
const THRESHOLDS = {
  performance: 70, // Lower if app is complex
  accessibility: 85, // Keep high for inclusivity
  "best-practices": 80, // Standard baseline
  seo: 80, // Important for discoverability
};
```

### Test Different Pages

Add more URLs to audit:

```typescript
const pages = [
  { name: "Home", url: "http://localhost:5173" },
  { name: "Cart", url: "http://localhost:5173/cart" },
  // Add more pages...
];
```

### Change Audit Settings

Modify `lighthouse.config.js` for different scenarios:

- Mobile vs Desktop
- Network throttling
- CPU throttling
- Specific audit categories

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Lighthouse Tests

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build app
        run: npm run build

      - name: Start server in background
        run: npm run preview &

      - name: Wait for server
        run: npx wait-on http://localhost:5173

      - name: Run Lighthouse tests
        run: npm run test:lighthouse
```

## Troubleshooting

### "Port 5173 not available"

- Make sure dev server is running: `npm run dev`
- Check if another app is using port 5173

### "Chrome not found"

- Install Chrome or Chromium
- Set CHROME_PATH environment variable

### Tests are slow

- Normal! Lighthouse tests take 10-60s per page
- Run fewer tests during development
- Use detailed tests only when needed

### Inconsistent scores

- Lighthouse scores can vary slightly (±5 points)
- System load affects performance scores
- Run multiple times for baseline

## Tips for Better Scores

### Performance

- ✅ Minimize bundle size
- ✅ Optimize images (WebP, compression)
- ✅ Use code splitting
- ✅ Enable gzip/brotli compression
- ✅ Lazy load non-critical resources

### Accessibility

- ✅ Use semantic HTML
- ✅ Provide alt text for images
- ✅ Ensure sufficient color contrast
- ✅ Make interactive elements keyboard accessible
- ✅ Test with screen readers

### Best Practices

- ✅ Use HTTPS (even in dev)
- ✅ Avoid console errors
- ✅ Use modern JavaScript features
- ✅ Avoid deprecated APIs
- ✅ Keep dependencies updated

### SEO

- ✅ Add meaningful page titles
- ✅ Include meta descriptions
- ✅ Use proper heading hierarchy
- ✅ Ensure mobile responsiveness
- ✅ Add structured data

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Web Accessibility Standards](https://www.w3.org/WAI/WCAG21/quickref/)
- [Performance Best Practices](https://web.dev/fast/)

## Next Steps

1. ✅ Run initial tests to establish baseline
2. ✅ Fix any critical issues (red scores)
3. ✅ Set up CI/CD integration
4. ✅ Monitor scores over time
5. ✅ Continuously optimize and improve
