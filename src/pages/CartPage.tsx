/**
 * CartPage - displays user's cart items
 * Supports removing items and checkout
 * Requires user to be logged in
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../components/CartItem";
import { useUser } from "../context/UserContext";
import { getCart, removeFromCart, checkout } from "../api/api";
import type { CartItemDto, CheckoutResultDto } from "../types/api";
import styles from "./CartPage.module.css";

export function CartPage() {
  const navigate = useNavigate();
  const { currentUserId } = useUser();

  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] =
    useState<CheckoutResultDto | null>(null);

  useEffect(() => {
    if (!currentUserId) {
      navigate("/register");
      return;
    }
    loadCart();
  }, [currentUserId, navigate]);

  const loadCart = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getCart(currentUserId);
      setCartItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    if (!currentUserId) return;

    try {
      setError(null);
      await removeFromCart(currentUserId, productId);
      // Reload cart after removal
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!currentUserId) return;

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setError(null);
      const result = await checkout(currentUserId);
      setCheckoutResult(result);

      if (result.success) {
        // Clear cart after successful checkout
        setCartItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  if (!currentUserId) {
    return null; // Will redirect to register
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading cart...</div>
      </div>
    );
  }

  // Show checkout result if available
  if (checkoutResult) {
    return (
      <div className={styles.container}>
        <div
          className={
            checkoutResult.success ? styles.successCard : styles.errorCard
          }
        >
          <h2 className={styles.resultTitle}>
            {checkoutResult.success
              ? "✓ Checkout Successful!"
              : "Checkout Failed"}
          </h2>
          <p className={styles.resultMessage}>{checkoutResult.message}</p>

          {checkoutResult.success &&
            checkoutResult.totalAmount !== undefined && (
              <div className={styles.totalAmount}>
                <strong>Total Amount:</strong> $
                {checkoutResult.totalAmount.toFixed(2)}
              </div>
            )}

          {checkoutResult.purchasedItems &&
            checkoutResult.purchasedItems.length > 0 && (
              <div className={styles.purchasedItems}>
                <h3>Purchased Items:</h3>
                <ul>
                  {checkoutResult.purchasedItems.map((item) => (
                    <li key={item.id}>
                      {item.productName} x {item.quantity} - $
                      {item.subtotal.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <button onClick={() => navigate("/")} className={styles.continueBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Shopping Cart</h2>

      {error && <div className={styles.error}>{error}</div>}

      {cartItems.length === 0 ? (
        <div className={styles.empty}>
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/")} className={styles.shopBtn}>
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className={styles.items}>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.total}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalValue}>
                ${calculateTotal().toFixed(2)}
              </span>
            </div>

            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
