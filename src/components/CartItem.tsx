/**
 * CartItem component for displaying a single cart item
 * Shows product details, quantity, subtotal, and remove button
 */

import type { CartItemDto } from "../types/api";
import styles from "./CartItem.module.css";

interface CartItemProps {
  item: CartItemDto;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  const handleRemove = () => {
    onRemove(item.productId);
  };

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <h3 className={styles.name}>{item.productName}</h3>
        <p className={styles.price}>Price: ${item.price.toFixed(2)}</p>
      </div>

      <div className={styles.quantity}>
        <span>Quantity: {item.quantity}</span>
      </div>

      <div className={styles.subtotal}>
        <span className={styles.subtotalLabel}>Subtotal:</span>
        <span className={styles.subtotalValue}>
          ${item.subtotal.toFixed(2)}
        </span>
      </div>

      <button onClick={handleRemove} className={styles.removeBtn}>
        Remove
      </button>
    </div>
  );
}
