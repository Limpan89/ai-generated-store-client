/**
 * Home page - displays product list
 * Fetches all products from API and renders ProductCard components
 * Supports adding to cart for logged-in users
 */

import { useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { useUser } from "../context/UserContext";
import { getProducts, addToCart } from "../api/api";
import type { ProductDto } from "../types/api";
import styles from "./Home.module.css";

export function Home() {
  const { currentUserId } = useUser();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number, quantity: number) => {
    if (!currentUserId) {
      setMessage("Please register or login to add items to cart");
      return;
    }

    try {
      setMessage(null);
      await addToCart(currentUserId, { productId, quantity });
      setMessage("Item added to cart!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={loadProducts} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Products</h2>

      {message && <div className={styles.message}>{message}</div>}

      {products.length === 0 ? (
        <p className={styles.empty}>No products available</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
