/**
 * ProductCard component for displaying product summary in a card
 * Used in product list pages
 */

import { Link } from "react-router-dom";
import type { ProductDto } from "../types/api";
import { useUser } from "../context/UserContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: number, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { currentUserId } = useUser();

  const handleAddToCart = () => {
    if (onAddToCart && currentUserId) {
      onAddToCart(product.id, 1);
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.link}>
        <h3 className={styles.name}>{product.name}</h3>
      </Link>

      {product.description && (
        <p className={styles.description}>
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>
      )}

      <div className={styles.details}>
        <span className={styles.price}>${product.price.toFixed(2)}</span>
        <span className={isOutOfStock ? styles.outOfStock : styles.inStock}>
          {isOutOfStock ? "Out of Stock" : `${product.stockQuantity} in stock`}
        </span>
      </div>

      {currentUserId ? (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={styles.addBtn}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      ) : (
        <Link to="/register" className={styles.registerLink}>
          Register to purchase
        </Link>
      )}
    </div>
  );
}
