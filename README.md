# AI Generated Store - Frontend

A React + TypeScript frontend application for the AI Generated Store, built with Vite. This application provides a complete e-commerce interface to interact with the ASP.NET Core backend.

## 🚀 Features

- **Product Browsing**: View all available products with details and stock information
- **User Registration**: Simple registration flow with form validation
- **Shopping Cart**: Add/remove items and manage quantities
- **Checkout**: Complete purchase flow with order confirmation
- **Responsive Design**: Clean, minimal CSS modules for all screen sizes
- **Type Safety**: Full TypeScript support with strict mode
- **State Management**: React Context for global user state
- **Persistent Sessions**: LocalStorage for user session persistence

## 📋 Prerequisites

- **Node.js**: v18+ (v20 recommended)
- **npm**: v9+ or **pnpm** or **yarn**
- **Backend API**: AIGeneratedStore backend running (default: `http://localhost:5000`)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **CSS Modules** - Component-scoped styling
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

## 📁 Project Structure

```
ai-generated-store-client/
├── src/
│   ├── api/
│   │   └── api.ts              # Typed API client functions
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Header.module.css
│   │   ├── ProductCard.tsx     # Product card component
│   │   ├── ProductCard.module.css
│   │   ├── CartItem.tsx        # Cart item component
│   │   └── CartItem.module.css
│   ├── context/
│   │   └── UserContext.tsx     # Global user state provider
│   ├── pages/
│   │   ├── Home.tsx            # Products list page
│   │   ├── Home.module.css
│   │   ├── ProductDetail.tsx   # Single product detail
│   │   ├── ProductDetail.module.css
│   │   ├── Register.tsx        # User registration
│   │   ├── Register.module.css
│   │   ├── CartPage.tsx        # Shopping cart & checkout
│   │   └── CartPage.module.css
│   ├── types/
│   │   └── api.ts              # TypeScript DTOs/interfaces
│   ├── __tests__/
│   │   ├── Register.test.tsx   # Unit tests for Register
│   │   └── api.test.ts         # Unit tests for API client
│   ├── App.tsx                 # Main app with routes
│   ├── App.css
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── vite-env.d.ts           # Vite types
│   └── setupTests.ts           # Test configuration
├── e2e/
│   └── store.spec.ts           # Playwright E2E tests
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Vitest configuration
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript config
├── tsconfig.node.json          # TS config for Node scripts
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (local)
├── .env.example                # Example environment variables
└── .gitignore
```

## 🔧 Installation

### 1. Clone or navigate to the project

```bash
cd ai-generated-store-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update the API URL:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create .env file
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Ensure backend is running

Make sure the ASP.NET Core backend (`AIGeneratedStore`) is running on `http://localhost:5000` (or update the URL in `.env` accordingly).

**Start backend:**

```bash
cd ../AIGeneratedStore  # Or wherever your backend is located
dotnet run
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Opens at: `http://localhost:5173`

The dev server includes:

- ⚡ Hot Module Replacement (HMR)
- 🔍 Fast refresh for React components
- 📝 TypeScript error checking

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally at `http://localhost:4173`.

## 🧪 Testing

### Unit Tests (Vitest)

Run all unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm test
```

Run tests once (CI mode):

```bash
npm run test:unit
```

### E2E Tests (Playwright)

**Prerequisites**: Both frontend and backend must be running.

Install Playwright browsers (first time only):

```bash
npx playwright install
```

Run E2E tests:

```bash
npm run test:e2e
```

Run with UI mode:

```bash
npm run test:e2e:ui
```

### Lighthouse Tests

**Performance, Accessibility, and Best Practices auditing**

Prerequisites: Dev server must be running at `http://localhost:5173`

```bash
# Start dev server first (in one terminal)
npm run dev

# Run Lighthouse tests (in another terminal)
npm run test:lighthouse

# Or run in watch mode
npm run test:lighthouse:watch
```

**What Lighthouse tests check:**

- ⚡ Performance metrics (FCP, LCP, TBT, CLS)
- ♿ Accessibility compliance (WCAG standards)
- ✅ Best practices (security, modern standards)
- 🔍 SEO optimization

See [lighthouse/QUICKSTART.md](lighthouse/QUICKSTART.md) for detailed guide.

## 🔌 API Integration

### Environment Configuration

The app uses `VITE_API_BASE_URL` environment variable to configure the backend URL.

- **Development**: `http://localhost:5000`
- **Production**: Update `.env` with your production API URL

### API Endpoints Used

All endpoints are implemented in `src/api/api.ts`:

#### Users

- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

#### Cart

- `GET /api/cart?userId={userId}` - Get cart items
- `POST /api/cart/add?userId={userId}` - Add item to cart
- `DELETE /api/cart/remove/{productId}?userId={userId}` - Remove from cart
- `POST /api/cart/checkout?userId={userId}` - Checkout cart

### Error Handling

The API client (`src/api/api.ts`) includes:

- ✅ Automatic error parsing from JSON responses
- ✅ Typed error messages
- ✅ Proper HTTP status code handling
- ✅ TypeScript return types for all functions

## 🎨 Styling

This project uses **CSS Modules** for component-scoped styling.

### Styling Convention

Each component has its own `.module.css` file:

```
ProductCard.tsx
ProductCard.module.css
```

Import styles:

```tsx
import styles from "./ProductCard.module.css";

<div className={styles.card}>...</div>;
```

### Global Styles

Global styles are in `src/index.css` for app-wide defaults.

## 🔐 User Authentication Flow

1. **Register**: User fills form → POST `/api/users` → Backend returns `UserDto` with `id`
2. **Store ID**: Frontend stores `userId` in:
   - React Context (`UserContext`)
   - `localStorage` (key: `ai-store-user-id`)
3. **Persist Session**: On page reload, `userId` is loaded from `localStorage`
4. **Logout**: Clear `userId` from Context and `localStorage`

## 🛒 Shopping Flow

### 1. Browse Products

- View products on home page (`/`)
- Click product name to view details (`/product/:id`)

### 2. Add to Cart

- Must be registered/logged in
- Click "Add to Cart" button
- Validates stock quantity before adding

### 3. View Cart

- Navigate to `/cart`
- Shows all cart items with quantities and subtotals
- Can remove items

### 4. Checkout

- Click "Proceed to Checkout"
- Backend validates stock and processes order
- Shows confirmation with total amount and purchased items

## 📝 Code Organization

### Component Design

- **Functional components** with React Hooks
- **TypeScript** strict mode enabled
- **Props interfaces** defined for all components
- **CSS Modules** for scoped styling

### State Management

- **React Context** for global user state
- **useState** for local component state
- **useEffect** for side effects (API calls)

### API Client

- Centralized in `src/api/api.ts`
- All functions are **typed** with TypeScript
- Returns `Promise<T>` for all async operations
- Error handling with try/catch

## 🐛 Troubleshooting

### Issue: CORS Errors

**Symptom**: Browser console shows CORS policy errors.

**Solution**: Ensure backend CORS policy allows `http://localhost:5173`:

In backend `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### Issue: Backend Not Running

**Symptom**: API calls fail with network errors.

**Solution**:

1. Verify backend is running: `dotnet run` in backend folder
2. Check backend URL: `http://localhost:5000`
3. Update `.env` if using different port

### Issue: Environment Variables Not Working

**Symptom**: API calls go to wrong URL or undefined.

**Solution**:

1. Ensure `.env` file exists in project root
2. Restart Vite dev server after changing `.env`
3. Environment variables must start with `VITE_`

### Issue: Products Not Loading

**Symptom**: Home page shows "No products available" or loading forever.

**Solution**:

1. Check if backend database is seeded with products
2. Verify backend is running and accessible
3. Open browser DevTools → Network tab to see API response
4. Check for CORS errors in Console tab

### Issue: User Registration Fails

**Symptom**: Registration shows error or doesn't save user ID.

**Solution**:

1. Check if username/email already exists (backend validation)
2. Verify backend returns `UserDto` with `id` field
3. Check browser's localStorage for `ai-store-user-id` key
4. Clear localStorage and try again: `localStorage.clear()`

### Issue: TypeScript Errors

**Symptom**: Type errors in IDE or build fails.

**Solution**:

```bash
# Install all dependencies
npm install

# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## 📚 Available Scripts

| Script                | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start development server (port 5173) |
| `npm run build`       | Build for production                 |
| `npm run preview`     | Preview production build locally     |
| `npm run lint`        | Run ESLint on all TypeScript files   |
| `npm test`            | Run unit tests in watch mode         |
| `npm run test:unit`   | Run unit tests once (CI)             |
| `npm run test:e2e`    | Run Playwright E2E tests             |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI     |

## 🔄 Development Workflow

### 1. Start Backend

```bash
cd AIGeneratedStore
dotnet run
```

### 2. Start Frontend

```bash
cd ai-generated-store-client
npm run dev
```

### 3. Make Changes

- Edit components in `src/`
- Hot reload will update browser automatically
- TypeScript errors shown in terminal and IDE

### 4. Test Changes

```bash
# Unit tests
npm test

# E2E tests (ensure both frontend & backend running)
npm run test:e2e
```

### 5. Build for Production

```bash
npm run build
```

## 📦 Deployment

### Build Production Bundle

```bash
npm run build
```

Output: `dist/` folder with optimized static files.

### Deploy to Hosting

Deploy `dist/` folder to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **Azure Static Web Apps**: Use VS Code extension
- **GitHub Pages**: Push `dist/` to `gh-pages` branch

**Important**: Update `VITE_API_BASE_URL` in production `.env`:

```env
VITE_API_BASE_URL=https://your-production-api.com
```

## 🧩 Extending the App

### Add New Page

1. Create component in `src/pages/`:

```tsx
// src/pages/NewPage.tsx
export function NewPage() {
  return <div>New Page Content</div>;
}
```

2. Add route in `src/App.tsx`:

```tsx
import { NewPage } from "./pages/NewPage";

<Route path="/new" element={<NewPage />} />;
```

### Add New API Endpoint

1. Add type to `src/types/api.ts`:

```tsx
export interface NewDto {
  id: number;
  name: string;
}
```

2. Add function to `src/api/api.ts`:

```tsx
export async function getNewData(): Promise<NewDto[]> {
  const res = await fetch(`${BASE}/api/new`);
  return handleResponse<NewDto[]>(res);
}
```

### Add New Component

1. Create component file:

```tsx
// src/components/MyComponent.tsx
import styles from "./MyComponent.module.css";

export function MyComponent({ title }: { title: string }) {
  return <div className={styles.container}>{title}</div>;
}
```

2. Create CSS module:

```css
/* src/components/MyComponent.module.css */
.container {
  padding: 1rem;
  background: white;
}
```

## 📄 License

This project is part of the AI Generated Store application suite.

## 🤝 Contributing

1. Create a feature branch
2. Make changes with TypeScript strict mode
3. Add tests for new features
4. Ensure all tests pass: `npm test && npm run test:e2e`
5. Run linter: `npm run lint`
6. Submit pull request

## 📞 Support

For issues or questions:

1. Check troubleshooting section above
2. Review backend API documentation
3. Check browser console for errors
4. Verify backend is running and accessible

## 🎯 Next Steps

After setup:

1. ✅ Start backend API
2. ✅ Run `npm install`
3. ✅ Configure `.env`
4. ✅ Run `npm run dev`
5. ✅ Navigate to `http://localhost:5173`
6. ✅ Register a new user
7. ✅ Browse products and add to cart
8. ✅ Complete checkout flow

Happy coding! 🚀
