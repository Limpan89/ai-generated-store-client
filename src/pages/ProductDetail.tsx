/**
 * ProductDetail page - displays full product details
 * Allows adding product to cart with quantity selection
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getProductById, addToCart } from "../api/api";
import type { ProductDto } from "../types/api";
import styles from "./ProductDetail.module.css";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useUser();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id, 10));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!currentUserId) {
      setMessage("Please register or login to add items to cart");
      setTimeout(() => navigate("/register"), 2000);
      return;
    }

    if (!product) return;

    // Validate quantity
    if (quantity <= 0) {
      setMessage("Quantity must be greater than 0");
      return;
    }

    if (quantity > product.stockQuantity) {
      setMessage(`Only ${product.stockQuantity} items available in stock`);
      return;
    }

    try {
      setMessage(null);
      await addToCart(currentUserId, { productId: product.id, quantity });
      setMessage("Item added to cart!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || "Product not found"}</div>
        <button onClick={() => navigate("/")} className={styles.backBtn}>
          Back to Products
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/")} className={styles.backBtn}>
        ← Back to Products
      </button>

      <div className={styles.product}>
        <div className={styles.header}>
          <h1 className={styles.name}>{product.name}</h1>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>

        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}

        <div className={styles.stock}>
          <span className={isOutOfStock ? styles.outOfStock : styles.inStock}>
            {isOutOfStock
              ? "Out of Stock"
              : `${product.stockQuantity} available`}
          </span>
        </div>

        {message && <div className={styles.message}>{message}</div>}

        {currentUserId ? (
          <div className={styles.addToCart}>
            <label htmlFor="quantity" className={styles.label}>
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuantity(isNaN(val) ? 1 : val);
              }}
              disabled={isOutOfStock}
              className={styles.quantityInput}
            />
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={styles.addBtn}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ) : (
          <div className={styles.loginPrompt}>
            <p>Please register or login to purchase this product</p>
            <button
              onClick={() => navigate("/register")}
              className={styles.registerBtn}
            >
              Register / Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
