# Lighthouse Testing Setup - Summary

## ✅ What Was Added

### 📦 Dependencies

- **lighthouse** - Google's automated auditing tool for web apps
- **chrome-launcher** - Programmatically launch Chrome for testing

### 📁 New Files Created

#### Test Files

1. **`lighthouse/lighthouse.test.ts`**

   - Main test suite for overall score thresholds
   - Tests: Performance, Accessibility, Best Practices, SEO
   - Tests multiple pages (home, product detail)

2. **`lighthouse/lighthouse-detailed.test.ts`**

   - Detailed metric-specific tests
   - Core Web Vitals: FCP, LCP, CLS, TBT, Speed Index
   - Accessibility audit checks
   - Image optimization verification

3. **`lighthouse/lighthouse-example.test.ts`**
   - Example test demonstrating utility functions
   - Multi-page auditing
   - Comprehensive reporting with emojis and formatting

#### Utility & Config Files

4. **`lighthouse/utils.ts`**

   - Helper functions for extracting scores and metrics
   - Format functions for pretty console output
   - Server health check utilities

5. **`lighthouse.config.js`**

   - Lighthouse configuration (desktop settings, throttling)

6. **`vitest.lighthouse.config.ts`**
   - Separate Vitest config for Lighthouse tests
   - Extended timeouts (Lighthouse tests are slower)

#### Documentation

7. **`lighthouse/README.md`**

   - Comprehensive documentation
   - How to run tests, adjust thresholds
   - CI/CD integration examples

8. **`lighthouse/QUICKSTART.md`**
   - Quick start guide for beginners
   - Common scenarios and troubleshooting
   - Tips for improving scores

### ⚙️ Configuration Changes

#### `package.json`

Added new test scripts:

```json
"test:lighthouse": "vitest run --config vitest.lighthouse.config.ts",
"test:lighthouse:watch": "vitest --config vitest.lighthouse.config.ts"
```

#### `vitest.config.ts`

Added lighthouse folder to exclusions:

```typescript
exclude: ["**/node_modules/**", "**/e2e/**", "**/lighthouse/**"];
```

#### `README.md`

Added Lighthouse testing section with instructions

## 🚀 How to Use

### Quick Start

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Lighthouse tests
npm run test:lighthouse
```

### Available Tests

**Overall Scores** (`lighthouse.test.ts`):

- ✅ Home page meets performance threshold (≥70)
- ✅ Home page meets accessibility threshold (≥85)
- ✅ Home page meets best practices threshold (≥80)
- ✅ Home page meets SEO threshold (≥80)
- ✅ Product detail page audits
- ✅ Comprehensive multi-category report

**Detailed Metrics** (`lighthouse-detailed.test.ts`):

- ✅ First Contentful Paint (< 2s)
- ✅ Largest Contentful Paint (< 2.5s)
- ✅ Cumulative Layout Shift (< 0.1)
- ✅ Total Blocking Time (< 300ms)
- ✅ Speed Index (< 3.4s)
- ✅ Accessibility audits check
- ✅ Image optimization check

**Example Test** (`lighthouse-example.test.ts`):

- Demonstrates utility usage
- Multi-page auditing
- Custom reporting

## 📊 What Gets Tested

### Performance Metrics

- **First Contentful Paint (FCP)** - When first content appears
- **Largest Contentful Paint (LCP)** - When main content loads (Core Web Vital)
- **Cumulative Layout Shift (CLS)** - Visual stability (Core Web Vital)
- **Total Blocking Time (TBT)** - Main thread blocking time
- **Speed Index** - How quickly content is visually displayed
- **Time to Interactive (TTI)** - When page becomes fully interactive

### Accessibility Checks

- ARIA attributes correctness
- Color contrast ratios
- Form labels and inputs
- Image alt text
- Button names
- Link names
- HTML language attributes
- Document structure
- And 20+ other WCAG criteria

### Best Practices

- HTTPS usage
- No console errors
- Modern JavaScript APIs
- Image aspect ratios
- No deprecated code
- Security headers

### SEO

- Meta descriptions
- Page titles
- Mobile-friendliness
- Robots.txt
- Structured data

## 🎯 Default Thresholds

The tests use these minimum score requirements:

- **Performance**: 70/100
- **Accessibility**: 85/100
- **Best Practices**: 80/100
- **SEO**: 80/100

These can be adjusted in the test files based on your needs.

## 💡 Tips

1. **First Run**: Tests might take 2-3 minutes total
2. **Scores Vary**: ±5 points is normal between runs
3. **System Load**: High CPU usage affects performance scores
4. **Mobile vs Desktop**: Tests default to desktop (configurable)
5. **Watch Mode**: Great for iterative optimization

## 🔧 Customization

### Change Thresholds

Edit the `THRESHOLDS` constant in test files:

```typescript
const THRESHOLDS = {
  performance: 70,
  accessibility: 85,
  "best-practices": 80,
  seo: 80,
};
```

### Test More Pages

Add URLs to the test arrays:

```typescript
const pages = [
  { name: "Home", url: "http://localhost:5173" },
  { name: "Cart", url: "http://localhost:5173/cart" },
];
```

### Adjust Settings

Modify `lighthouse.config.js` for:

- Mobile testing
- Network throttling
- CPU throttling
- Specific categories

## 📈 Next Steps

1. **Run Initial Audit**: Establish baseline scores
2. **Fix Critical Issues**: Address red (0-49) scores first
3. **Optimize Gradually**: Improve yellow (50-89) scores
4. **Monitor Over Time**: Track scores as you develop
5. **Add to CI/CD**: Automate testing in pipelines

## 🆘 Troubleshooting

**"Cannot connect to http://localhost:5173"**

- Start dev server first: `npm run dev`

**"Chrome not found"**

- Install Chrome or Chromium browser
- Or set CHROME_PATH env variable

**Tests timeout**

- Normal for first run (downloading Chrome)
- Increase timeout in vitest.lighthouse.config.ts

**Low scores**

- Check specific audit failures in console
- See lighthouse/QUICKSTART.md for optimization tips

## 📚 Resources

- Full docs: [lighthouse/README.md](lighthouse/README.md)
- Quick guide: [lighthouse/QUICKSTART.md](lighthouse/QUICKSTART.md)
- Utility functions: [lighthouse/utils.ts](lighthouse/utils.ts)
- Example test: [lighthouse/lighthouse-example.test.ts](lighthouse/lighthouse-example.test.ts)

## 🎉 Benefits

With Lighthouse testing, you now have:

- ✅ Automated quality checks
- ✅ Performance regression detection
- ✅ Accessibility compliance verification
- ✅ SEO optimization validation
- ✅ CI/CD integration capability
- ✅ Detailed metric tracking
- ✅ Industry-standard auditing

Happy testing! 🚀
