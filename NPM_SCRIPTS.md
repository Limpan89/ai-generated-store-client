# NPM Scripts Reference

Complete reference for all npm scripts in this project.

---

## 🚀 Development Commands

### `npm run dev`

**Purpose**: Start the Vite development server

**What it does**:

- Starts dev server on `http://localhost:5173`
- Enables Hot Module Replacement (HMR)
- Opens browser automatically
- Shows TypeScript errors in terminal
- Watches for file changes

**When to use**: During active development

**Example**:

```bash
npm run dev
```

---

### `npm run build`

**Purpose**: Build the app for production

**What it does**:

- Runs TypeScript compiler (`tsc`) to check types
- Bundles and minifies all code with Vite
- Optimizes assets (images, CSS, JS)
- Creates `dist/` folder with production files
- Generates source maps

**When to use**: Before deploying to production

**Example**:

```bash
npm run build
```

**Output**: `dist/` folder

---

### `npm run preview`

**Purpose**: Preview the production build locally

**What it does**:

- Serves the `dist/` folder on `http://localhost:4173`
- Tests production build without deploying
- Uses production optimizations

**When to use**: After `npm run build`, to test production build

**Example**:

```bash
npm run build
npm run preview
```

---

## 🧪 Testing Commands

### `npm test`

**Purpose**: Run unit tests in watch mode

**What it does**:

- Starts Vitest in watch mode
- Re-runs tests on file changes
- Shows test coverage
- Runs tests matching changed files

**When to use**: During active development, for TDD

**Example**:

```bash
npm test
```

**Press keys**:

- `a` - Run all tests
- `f` - Run failed tests only
- `q` - Quit watch mode

---

### `npm run test:unit`

**Purpose**: Run unit tests once (CI mode)

**What it does**:

- Runs all unit tests once
- Exits after completion
- Shows pass/fail summary
- No watch mode

**When to use**: In CI/CD pipeline, pre-commit hooks

**Example**:

```bash
npm run test:unit
```

---

### `npm run test:e2e`

**Purpose**: Run end-to-end tests with Playwright

**What it does**:

- Starts Playwright test runner
- Runs all E2E tests in `e2e/` folder
- Tests in headless browsers (Chrome, Firefox, Safari)
- Generates HTML report

**When to use**: Before deployment, to verify complete flows

**Prerequisites**:

- Both frontend and backend must be running
- Playwright browsers installed (`npx playwright install`)

**Example**:

```bash
# Terminal 1: Start backend
cd AIGeneratedStore
dotnet run

# Terminal 2: Start frontend
cd ai-generated-store-client
npm run dev

# Terminal 3: Run E2E tests
npm run test:e2e
```

---

### `npm run test:e2e:ui`

**Purpose**: Run E2E tests with Playwright UI

**What it does**:

- Opens Playwright Test UI
- Shows test execution visually
- Allows debugging
- Can run individual tests

**When to use**: Debugging E2E test failures

**Example**:

```bash
npm run test:e2e:ui
```

---

## 🔍 Code Quality Commands

### `npm run lint`

**Purpose**: Run ESLint on TypeScript files

**What it does**:

- Checks all `.ts` and `.tsx` files
- Reports style and code quality issues
- Shows unused variables, imports
- Checks React hooks rules

**When to use**: Before committing code

**Example**:

```bash
npm run lint
```

**Fix errors automatically**:

```bash
npx eslint . --ext ts,tsx --fix
```

---

## 📦 Dependency Management

### `npm install`

**Purpose**: Install all dependencies

**What it does**:

- Reads `package.json`
- Installs all dependencies to `node_modules/`
- Creates `package-lock.json`
- Sets up project for development

**When to use**:

- First time setup
- After cloning repository
- After adding new dependencies

**Example**:

```bash
npm install
```

**Shorthand**:

```bash
npm i
```

---

### `npm install <package>`

**Purpose**: Add a new dependency

**What it does**:

- Downloads package from npm registry
- Adds to `node_modules/`
- Updates `package.json` and `package-lock.json`

**Example**:

```bash
# Production dependency
npm install axios

# Development dependency
npm install --save-dev prettier
```

---

### `npm update`

**Purpose**: Update dependencies to latest versions

**What it does**:

- Checks for newer versions
- Updates within semver range
- Updates `package-lock.json`

**Example**:

```bash
npm update
```

---

### `npm outdated`

**Purpose**: Check for outdated dependencies

**What it does**:

- Lists packages with available updates
- Shows current, wanted, and latest versions

**Example**:

```bash
npm outdated
```

---

## 🛠️ Utility Commands

### `npx playwright install`

**Purpose**: Install Playwright browser binaries

**What it does**:

- Downloads Chromium, Firefox, WebKit
- Sets up browsers for E2E testing

**When to use**: First time E2E test setup

**Example**:

```bash
npx playwright install
```

---

### `npx vite --version`

**Purpose**: Check Vite version

**Example**:

```bash
npx vite --version
```

---

### `npx tsc --noEmit`

**Purpose**: Check TypeScript errors without building

**What it does**:

- Type-checks all TypeScript files
- Shows errors but doesn't emit files
- Faster than full build

**Example**:

```bash
npx tsc --noEmit
```

---

## 🔄 Complete Workflow Examples

### Daily Development

```bash
# Start development server
npm run dev

# In another terminal, run tests in watch mode
npm test

# Lint before committing
npm run lint
```

---

### Pre-Deployment Checklist

```bash
# 1. Run linter
npm run lint

# 2. Run unit tests
npm run test:unit

# 3. Build for production
npm run build

# 4. Preview build
npm run preview

# 5. Run E2E tests (with servers running)
npm run test:e2e

# 6. Deploy dist/ folder
```

---

### Troubleshooting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix security issues automatically
npm audit fix
```

---

## 📊 Script Performance

| Script              | Typical Duration | Resource Usage |
| ------------------- | ---------------- | -------------- |
| `npm run dev`       | 1-3 seconds      | Low            |
| `npm run build`     | 5-15 seconds     | Medium         |
| `npm run preview`   | 1 second         | Low            |
| `npm test`          | 1-5 seconds      | Low            |
| `npm run test:unit` | 2-10 seconds     | Low            |
| `npm run test:e2e`  | 30-60 seconds    | High           |
| `npm run lint`      | 2-5 seconds      | Low            |

---

## 🎯 Quick Reference Table

| Goal                   | Command                 |
| ---------------------- | ----------------------- |
| Start developing       | `npm run dev`           |
| Run tests while coding | `npm test`              |
| Check code quality     | `npm run lint`          |
| Build for production   | `npm run build`         |
| Test production build  | `npm run preview`       |
| Run E2E tests          | `npm run test:e2e`      |
| Install dependencies   | `npm install`           |
| Add new package        | `npm install <package>` |
| Update packages        | `npm update`            |

---

## 💡 Pro Tips

### Parallel Commands (PowerShell)

```powershell
# Run dev server and tests in background
Start-Process -NoNewWindow npm -ArgumentList "run", "dev"
Start-Process -NoNewWindow npm -ArgumentList "test"
```

### Package.json Scripts Chaining

```json
"scripts": {
  "prebuild": "npm run lint",
  "build": "tsc && vite build",
  "postbuild": "echo Build complete!"
}
```

The `pre` and `post` prefixes run automatically before/after the main script.

### Environment-Specific Scripts

```json
"scripts": {
  "build:dev": "vite build --mode development",
  "build:prod": "vite build --mode production"
}
```

---

## 📚 Additional Resources

- [npm CLI Documentation](https://docs.npmjs.com/cli/)
- [Vite CLI](https://vitejs.dev/guide/cli.html)
- [Vitest CLI](https://vitest.dev/guide/cli.html)
- [Playwright CLI](https://playwright.dev/docs/test-cli)

---

**All scripts are ready to use!** Run `npm install` first, then use any command above.
