# AI Store Frontend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Create .env file (already created for you)
# Edit if your backend runs on a different port
```

`.env` content:

```
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
# First, ensure backend is running:
cd ../AIGeneratedStore
dotnet run

# Then, in a new terminal, start frontend:
cd ../ai-generated-store-client
npm run dev
```

Open browser at: **http://localhost:5173**

---

## 📁 File Structure Summary

```
src/
├── api/api.ts                  # API functions (getProducts, createUser, etc.)
├── types/api.ts                # TypeScript interfaces
├── context/UserContext.tsx     # Global state (currentUserId)
├── components/                 # Reusable UI components
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── CartItem.tsx
├── pages/                      # Route pages
│   ├── Home.tsx               # "/" - Products list
│   ├── ProductDetail.tsx      # "/product/:id"
│   ├── Register.tsx           # "/register"
│   └── CartPage.tsx           # "/cart"
├── App.tsx                     # Routes setup
└── main.tsx                    # App entry point
```

---

## 🔌 API Endpoints Reference

Base URL: `http://localhost:5000` (configurable via `.env`)

### Users

- `POST /api/users` - Register new user
- `GET /api/users/{id}` - Get user details

### Products

- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details

### Cart (requires `?userId={id}`)

- `GET /api/cart?userId={id}` - Get cart items
- `POST /api/cart/add?userId={id}` - Add to cart
  ```json
  { "productId": 1, "quantity": 2 }
  ```
- `DELETE /api/cart/remove/{productId}?userId={id}` - Remove from cart
- `POST /api/cart/checkout?userId={id}` - Complete checkout

---

## 🎯 User Flow

1. **Register**: `/register` → Enter username/email → User ID stored in localStorage
2. **Browse**: `/` → View products → Click product name for details
3. **Add to Cart**: Click "Add to Cart" button (must be logged in)
4. **View Cart**: Click "Cart" link in header → `/cart`
5. **Checkout**: Click "Proceed to Checkout" → See confirmation
6. **Logout**: Click "Logout" button in header

---

## 🧪 Testing

### Run Unit Tests

```bash
npm test                # Watch mode
npm run test:unit       # Run once
```

### Run E2E Tests

```bash
# Install browsers (first time only)
npx playwright install

# Run tests
npm run test:e2e        # Headless
npm run test:e2e:ui     # With UI
```

---

## 🐛 Common Issues

### CORS Error

**Fix**: Ensure backend allows `http://localhost:5173` in CORS policy.

### "Cannot find module 'react'"

**Fix**: Run `npm install`

### API calls fail

**Fix**:

1. Check backend is running: `http://localhost:5000`
2. Verify `.env` has correct `VITE_API_BASE_URL`
3. Restart dev server after changing `.env`

### Products not loading

**Fix**:

1. Verify backend is seeded with products
2. Check browser console for errors
3. Test API directly: `http://localhost:5000/api/products`

---

## 📝 Key Files to Edit

### Add New Page

1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/mypage" element={<MyPage />} />
   ```

### Add New API Call

1. Add type to `src/types/api.ts`
2. Add function to `src/api/api.ts`
3. Use in component with `useEffect`

### Modify Styles

Edit corresponding `.module.css` file for each component.

---

## 🔧 NPM Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start dev server (port 5173) |
| `npm run build`    | Build for production         |
| `npm run preview`  | Preview production build     |
| `npm test`         | Run unit tests               |
| `npm run test:e2e` | Run E2E tests                |
| `npm run lint`     | Run ESLint                   |

---

## 📚 Documentation

- Full docs: `README.md`
- API client: `src/api/api.ts`
- Type definitions: `src/types/api.ts`

---

**Happy coding!** 🎉
