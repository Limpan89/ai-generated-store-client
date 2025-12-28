# AI Store Frontend - Architecture Overview

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (User)                          │
│                     http://localhost:5173                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    React App (Frontend)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              main.tsx (Entry Point)                      │  │
│  │  - BrowserRouter                                         │  │
│  │  - UserContextProvider                                   │  │
│  └───────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│  ┌───────────────────────▼──────────────────────────────────┐  │
│  │                    App.tsx (Routes)                      │  │
│  │  - Route: / → Home                                       │  │
│  │  - Route: /product/:id → ProductDetail                   │  │
│  │  - Route: /register → Register                           │  │
│  │  - Route: /cart → CartPage                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Context (Global State)                     │  │
│  │  UserContext:                                            │  │
│  │    - currentUserId: number | null                        │  │
│  │    - setCurrentUserId()                                  │  │
│  │    - localStorage persistence                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  API Client Layer                        │  │
│  │  api.ts - Typed fetch wrappers:                          │  │
│  │    - getProducts()                                       │  │
│  │    - createUser()                                        │  │
│  │    - addToCart()                                         │  │
│  │    - checkout()                                          │  │
│  │    - Error handling                                      │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────┼─────────────────────────────────┘
                              │ fetch(VITE_API_BASE_URL + endpoint)
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│              ASP.NET Core Backend API                         │
│                  http://localhost:5000                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Controllers:                                            │ │
│  │    - UsersController                                     │ │
│  │    - ProductsController                                  │ │
│  │    - CartController                                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Database (EF Core):                                     │ │
│  │    - Users                                               │ │
│  │    - Products                                            │ │
│  │    - CartItems                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Hierarchy

```
App
├── Header (shows on all pages)
│   ├── Logo/Title
│   ├── Navigation Links
│   └── User Info / Login Status
│
└── Routes
    ├── Home (/)
    │   └── ProductCard[] (map over products)
    │
    ├── ProductDetail (/product/:id)
    │   └── Product Info + Add to Cart
    │
    ├── Register (/register)
    │   └── Registration Form
    │
    └── CartPage (/cart)
        ├── CartItem[] (map over cart items)
        └── Checkout Button
```

---

## 🔄 Data Flow

### User Registration Flow

```
User fills form
      ↓
Register.tsx validates input
      ↓
api.createUser() → POST /api/users
      ↓
Backend creates user → returns UserDto { id, username, email }
      ↓
setCurrentUserId(user.id)
      ↓
localStorage.setItem('ai-store-user-id', id)
      ↓
Navigate to Home (/)
```

### Add to Cart Flow

```
User clicks "Add to Cart"
      ↓
ProductCard.tsx / ProductDetail.tsx
      ↓
Check: currentUserId exists?
      ↓ Yes
api.addToCart(userId, { productId, quantity })
      ↓
POST /api/cart/add?userId=X
      ↓
Backend validates stock & adds to cart
      ↓
Show success message
```

### Checkout Flow

```
User on CartPage (/cart)
      ↓
Click "Proceed to Checkout"
      ↓
api.checkout(userId) → POST /api/cart/checkout?userId=X
      ↓
Backend:
  - Validates stock
  - Creates order
  - Deducts stock
  - Clears cart
      ↓
Returns CheckoutResultDto { success, message, totalAmount, purchasedItems }
      ↓
Display success message with total
```

---

## 🗂️ State Management

### Global State (React Context)

```
UserContext
├── currentUserId: number | null
├── setCurrentUserId: (id: number | null) => void
└── clearUser: () => void

Persists to: localStorage['ai-store-user-id']
Used by: Header, ProductCard, ProductDetail, CartPage
```

### Local State (useState)

```
Each Page Component:
├── loading: boolean
├── error: string | null
├── data: T[] | T | null
└── message: string | null (for success messages)
```

---

## 🎨 Styling Architecture

```
CSS Modules (scoped)
├── Component.module.css → component-specific styles
├── index.css → global styles (body, fonts, reset)
└── App.css → app-level layout

Benefits:
✓ No class name collisions
✓ Component encapsulation
✓ Tree-shakable
✓ TypeScript support
```

---

## 🔌 API Layer Design

```typescript
// src/api/api.ts

const BASE = import.meta.env.VITE_API_BASE_URL;

// Generic error handler
handleResponse<T>(res: Response): Promise<T>
  ├── if ok → parse JSON
  └── if error → throw with message

// Typed functions
export async function getProducts(): Promise<ProductDto[]>
export async function createUser(dto): Promise<UserDto>
export async function addToCart(userId, request): Promise<void>
export async function checkout(userId): Promise<CheckoutResultDto>

All functions:
✓ Return typed Promise<T>
✓ Use handleResponse for consistency
✓ Include headers (Content-Type, Accept)
✓ Throw typed errors
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```
src/__tests__/
├── api.test.ts
│   └── Mock fetch, test all API functions
└── Register.test.tsx
    └── Mock API, test registration flow

Tools:
- Vitest (test runner)
- React Testing Library (component tests)
- Mock functions (vi.fn, vi.mock)
```

### E2E Tests (Playwright)

```
e2e/store.spec.ts
├── Test: Register → Browse → Add to Cart → Checkout
├── Test: Product detail page navigation
├── Test: Form validation errors
└── Test: Logout functionality

Runs against:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
```

---

## 🚀 Build & Deploy Pipeline

```
Development
  ├── npm run dev
  ├── Vite dev server (port 5173)
  ├── Hot Module Replacement (HMR)
  └── TypeScript checking

Testing
  ├── npm test (Vitest - unit tests)
  └── npm run test:e2e (Playwright - E2E tests)

Production Build
  ├── npm run build
  ├── TypeScript compile (tsc)
  ├── Vite build (bundle, minify, optimize)
  └── Output: dist/ folder

Deploy
  └── Upload dist/ to hosting
      ├── Vercel
      ├── Netlify
      ├── Azure Static Web Apps
      └── AWS S3 + CloudFront
```

---

## 🔐 Security Considerations

### Current Implementation

- ✅ TypeScript strict mode (type safety)
- ✅ Client-side input validation
- ✅ Server error messages displayed safely
- ✅ CORS enabled on backend
- ✅ Environment variables for config

### Future Enhancements

- ⚠️ Add JWT authentication tokens
- ⚠️ Secure HTTP-only cookies for sessions
- ⚠️ XSS protection (React provides basic protection)
- ⚠️ CSRF tokens for state-changing operations
- ⚠️ Rate limiting on API calls

---

## 📱 Responsive Design

```
CSS Modules with Media Queries

Mobile (< 768px)
├── Stack layouts vertically
├── Full-width cards
└── Simplified navigation

Desktop (≥ 768px)
├── Grid layouts
├── Multi-column cards
└── Full navigation
```

---

## 🎯 Performance Optimizations

### Current

- ✅ Vite fast dev server
- ✅ React Fast Refresh
- ✅ CSS Modules (tree-shakable)
- ✅ Production build minification

### Future

- ⚠️ Code splitting (React.lazy)
- ⚠️ Image optimization
- ⚠️ Caching strategies (SWR, React Query)
- ⚠️ Virtual scrolling for large lists

---

## 🔄 User Session Management

```
Session Flow:

On App Load (main.tsx)
  ↓
UserContextProvider loads
  ↓
useEffect reads localStorage['ai-store-user-id']
  ↓
If found → setCurrentUserId(id)
  ↓
All components can access currentUserId via useUser()

On Logout
  ↓
clearUser() called
  ↓
localStorage.removeItem('ai-store-user-id')
  ↓
setCurrentUserId(null)
  ↓
UI updates (shows "Register" link)
```

---

## 📊 Type Safety Flow

```
Backend DTOs (C#)
  ↓
Frontend Interfaces (src/types/api.ts)
  ↓
API Functions (src/api/api.ts) - typed returns
  ↓
Component Props - typed interfaces
  ↓
State - typed with TypeScript
  ↓
Compile-time errors caught by tsc
```

---

## 🌐 Environment Configuration

```
Development (.env)
  VITE_API_BASE_URL=http://localhost:5000

Production (.env.production)
  VITE_API_BASE_URL=https://api.yourstore.com

Accessed via:
  import.meta.env.VITE_API_BASE_URL

Requirements:
  - Must prefix with VITE_
  - Restart dev server after changes
  - Never commit .env to git
```

---

## 📚 Key Dependencies

```
Production
├── react (18.2.0) - UI framework
├── react-dom (18.2.0) - DOM rendering
└── react-router-dom (6.20.0) - Routing

Development
├── vite (5.0.8) - Build tool
├── typescript (5.2.2) - Type system
├── vitest (1.0.4) - Testing
├── @testing-library/react (14.1.2) - Component testing
└── @playwright/test (1.40.0) - E2E testing
```

---

This architecture provides a solid foundation for a modern React + TypeScript e-commerce application with proper separation of concerns, type safety, and maintainability.
