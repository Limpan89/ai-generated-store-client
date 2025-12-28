/**
 * Main App component with routing configuration
 * Sets up all routes for the application with lazy loading
 */

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import "./App.css";

// Lazy load route components for better performance
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home }))
);
const ProductDetail = lazy(() =>
  import("./pages/ProductDetail").then((m) => ({ default: m.ProductDetail }))
);
const Register = lazy(() =>
  import("./pages/Register").then((m) => ({ default: m.Register }))
);
const CartPage = lazy(() =>
  import("./pages/CartPage").then((m) => ({ default: m.CartPage }))
);

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Suspense
          fallback={
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}
            >
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: "#3b82f6", textDecoration: "underline" }}>
        Go back to home
      </a>
    </div>
  );
}

export default App;
