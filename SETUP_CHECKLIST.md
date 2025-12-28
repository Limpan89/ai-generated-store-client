# 🚀 Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Prerequisites

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] Backend API (AIGeneratedStore) project available
- [ ] Backend running on `http://localhost:5000`

## ✅ Installation

- [ ] Navigate to project folder
- [ ] Run `npm install`
- [ ] Wait for dependencies to install (may take a few minutes)
- [ ] Verify no errors in terminal

## ✅ Configuration

- [ ] `.env` file exists in project root
- [ ] `VITE_API_BASE_URL` is set to `http://localhost:5000`
- [ ] Backend CORS allows `http://localhost:5173`

## ✅ Backend Verification

- [ ] Backend is running (`dotnet run` in AIGeneratedStore folder)
- [ ] Backend accessible at `http://localhost:5000`
- [ ] Test endpoint works: `http://localhost:5000/api/products`
- [ ] Products are seeded in database

## ✅ Frontend Startup

- [ ] Run `npm run dev`
- [ ] Dev server starts without errors
- [ ] Browser opens at `http://localhost:5173`
- [ ] App loads without console errors

## ✅ Functional Testing

### Home Page

- [ ] Products list displays
- [ ] Product cards show name, price, stock
- [ ] "Add to Cart" buttons visible (or "Register to purchase")
- [ ] Clicking product name navigates to detail page

### Registration

- [ ] Click "Register / Login" in header
- [ ] Registration form displays
- [ ] Enter username and email
- [ ] Submit creates user
- [ ] User ID appears in header
- [ ] localStorage contains user ID

### Product Detail

- [ ] Click product from home page
- [ ] Product details display
- [ ] Stock quantity shows
- [ ] Quantity input works
- [ ] "Add to Cart" button works (when logged in)

### Shopping Cart

- [ ] Add product to cart
- [ ] Success message appears
- [ ] Click "Cart" link in header
- [ ] Cart items display with quantity and subtotal
- [ ] "Remove" button works
- [ ] Total amount calculates correctly

### Checkout

- [ ] Click "Proceed to Checkout"
- [ ] Checkout success message displays
- [ ] Total amount shows
- [ ] Purchased items list displays
- [ ] "Continue Shopping" returns to home

### Logout

- [ ] Click "Logout" in header
- [ ] User ID removed from header
- [ ] "Register / Login" link appears
- [ ] Cart redirects to register page

## ✅ Development Workflow

- [ ] Hot reload works (edit a file and see changes)
- [ ] TypeScript errors show in terminal
- [ ] No console errors in browser

## ✅ Testing

- [ ] Run `npm test` (opens Vitest)
- [ ] Unit tests pass
- [ ] Run `npx playwright install` (first time)
- [ ] Run `npm run test:e2e` (with both servers running)
- [ ] E2E tests pass

## ✅ Build

- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] `dist/` folder created
- [ ] Run `npm run preview`
- [ ] Preview server works

## 🐛 Troubleshooting

If any step fails:

1. **npm install fails**

   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

2. **Dev server won't start**

   - Check if port 5173 is in use
   - Kill process using port: `netstat -ano | findstr :5173`

3. **CORS errors**

   - Verify backend CORS policy includes `http://localhost:5173`
   - Restart backend after CORS changes

4. **Products don't load**

   - Check backend is running
   - Test API: `http://localhost:5000/api/products`
   - Check browser console for errors

5. **Registration fails**

   - Check backend logs for errors
   - Verify request body format matches backend expectations
   - Check network tab in DevTools

6. **TypeScript errors**
   - Run `npm install` to ensure all types are installed
   - Restart TypeScript server in VS Code
   - Check `tsconfig.json` settings

## 📝 Success Criteria

Your setup is complete when:

✅ Dev server runs without errors  
✅ Products list loads from backend  
✅ User registration creates account  
✅ Cart operations work (add/remove/checkout)  
✅ All pages navigate correctly  
✅ Unit tests pass  
✅ Production build succeeds

## 🎉 You're Ready!

Once all checklist items are complete, you're ready to start developing!

Next steps:

- Customize styling to match your brand
- Add new features (search, filters, etc.)
- Enhance UX with loading states and animations
- Deploy to production

---

**Need help?** Check `README.md` for detailed troubleshooting or `QUICKSTART.md` for quick reference.
