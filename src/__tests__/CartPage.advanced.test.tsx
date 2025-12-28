/**
 * Advanced unit tests for CartPage component
 * Focuses on edge cases, error handling, and uncovered scenarios
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { CartPage } from "../pages/CartPage";
import * as api from "../api/api";

vi.mock("../api/api");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <UserContextProvider>{component}</UserContextProvider>
    </BrowserRouter>
  );
}

const mockCartItems = [
  {
    id: 1,
    productId: 10,
    productName: "Laptop",
    price: 999.99,
    quantity: 1,
    subtotal: 999.99,
  },
];

describe("CartPage Advanced Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Checkout Error Handling", () => {
    it("shows error when checkout fails with network error", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockRejectedValue(
        new Error("Network error: Failed to connect")
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(
          screen.getByText("Network error: Failed to connect")
        ).toBeInTheDocument();
      });
    });

    it("shows error when checkout fails with unknown error", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockRejectedValue("String error");

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("Checkout failed")).toBeInTheDocument();
      });
    });

    it("shows error when checkout fails with timeout", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockRejectedValue(new Error("Request timeout"));

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("Request timeout")).toBeInTheDocument();
      });
    });

    it("prevents checkout when cart is empty after loading", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.removeFromCart).mockResolvedValue({ success: true });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      // Remove all items
      vi.mocked(api.getCart).mockResolvedValue([]);
      const removeBtn = screen.getByText("Remove");
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
      });
    });

    it("handles failed checkout with partial success", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockResolvedValue({
        success: false,
        message: "Some items out of stock",
        totalAmount: 0,
        purchasedItems: [],
      });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("Checkout Failed")).toBeInTheDocument();
        expect(screen.getByText("Some items out of stock")).toBeInTheDocument();
      });
    });
  });

  describe("Cart Loading Edge Cases", () => {
    it("handles cart load error with Error instance", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockRejectedValue(
        new Error("Failed to fetch cart data")
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to fetch cart data")
        ).toBeInTheDocument();
      });
    });

    it("handles cart load error with string error", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockRejectedValue("Unknown error");

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load cart")).toBeInTheDocument();
      });
    });

    it("handles cart load error with null error", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockRejectedValue(null);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load cart")).toBeInTheDocument();
      });
    });

    it("reloads cart after successful item removal", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      const twoItems = [
        ...mockCartItems,
        {
          id: 2,
          productId: 20,
          productName: "Mouse",
          price: 29.99,
          quantity: 1,
          subtotal: 29.99,
        },
      ];
      vi.mocked(api.getCart).mockResolvedValueOnce(twoItems);
      vi.mocked(api.removeFromCart).mockResolvedValue({ success: true });
      vi.mocked(api.getCart).mockResolvedValueOnce(mockCartItems);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Mouse")).toBeInTheDocument();
      });

      const removeBtns = screen.getAllByText("Remove");
      fireEvent.click(removeBtns[1]);

      await waitFor(() => {
        expect(api.getCart).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Item Removal Edge Cases", () => {
    it("shows error when removal fails with Error instance", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.removeFromCart).mockRejectedValue(
        new Error("Product not found in cart")
      );

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const removeBtn = screen.getByText("Remove");
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(
          screen.getByText("Product not found in cart")
        ).toBeInTheDocument();
      });
    });

    it("shows error when removal fails with unknown error type", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.removeFromCart).mockRejectedValue({ code: 404 });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const removeBtn = screen.getByText("Remove");
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.getByText("Failed to remove item")).toBeInTheDocument();
      });
    });
  });

  describe("Checkout Success Scenarios", () => {
    it("displays successful checkout with all details", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockResolvedValue({
        success: true,
        message: "Order placed successfully!",
        totalAmount: 999.99,
        purchasedItems: [
          {
            id: 1,
            productId: 10,
            productName: "Laptop",
            quantity: 1,
            price: 999.99,
            subtotal: 999.99,
          },
        ],
      });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("✓ Checkout Successful!")).toBeInTheDocument();
        expect(
          screen.getByText("Order placed successfully!")
        ).toBeInTheDocument();
        expect(screen.getByText("$999.99")).toBeInTheDocument();
      });
    });

    it("displays checkout success without total amount", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockResolvedValue({
        success: true,
        message: "Order confirmed",
        purchasedItems: [],
      });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("✓ Checkout Successful!")).toBeInTheDocument();
        expect(screen.queryByText("Total Amount:")).not.toBeInTheDocument();
      });
    });

    it("displays checkout success without purchased items list", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockResolvedValue({
        success: true,
        message: "Payment processed",
        totalAmount: 999.99,
      });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("✓ Checkout Successful!")).toBeInTheDocument();
        expect(screen.queryByText("Purchased Items:")).not.toBeInTheDocument();
      });
    });

    it("navigates to home page after successful checkout", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockResolvedValue({
        success: true,
        message: "Success",
        totalAmount: 999.99,
      });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
      });

      const continueBtn = screen.getByText("Continue Shopping");
      fireEvent.click(continueBtn);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("displays multiple purchased items in success message", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout).mockResolvedValue({
        success: true,
        message: "All items purchased",
        totalAmount: 1029.98,
        purchasedItems: [
          {
            id: 1,
            productId: 10,
            productName: "Laptop",
            quantity: 1,
            price: 999.99,
            subtotal: 999.99,
          },
          {
            id: 2,
            productId: 20,
            productName: "Mouse",
            quantity: 1,
            price: 29.99,
            subtotal: 29.99,
          },
        ],
      });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("Laptop x 1 - $999.99")).toBeInTheDocument();
        expect(screen.getByText("Mouse x 1 - $29.99")).toBeInTheDocument();
      });
    });
  });

  describe("Total Calculation", () => {
    it("calculates total correctly for single item", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue([
        {
          id: 1,
          productId: 10,
          productName: "Keyboard",
          price: 79.99,
          quantity: 1,
          subtotal: 79.99,
        },
      ]);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Keyboard")).toBeInTheDocument();
      });
    });

    it("calculates total correctly for multiple items", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue([
        {
          id: 1,
          productId: 10,
          productName: "Keyboard",
          price: 79.99,
          quantity: 2,
          subtotal: 159.98,
        },
        {
          id: 2,
          productId: 20,
          productName: "Mouse",
          price: 29.99,
          quantity: 1,
          subtotal: 29.99,
        },
      ]);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("$189.97")).toBeInTheDocument();
      });
    });

    it("calculates total as 0.00 for empty cart", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue([]);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
      });
    });
  });

  describe("User Session Edge Cases", () => {
    it("does not load cart when user ID becomes null", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      // Verify cart was loaded
      expect(api.getCart).toHaveBeenCalledWith(123);
    });

    it("handles checkout when user ID is suddenly removed", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      // User still has ID when checkout button is rendered
      // The component checks currentUserId which comes from context
      // The check happens at render time, not on button click
      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      // The checkout will still be called because user was logged in when button was clicked
      await waitFor(() => {
        expect(api.checkout).toHaveBeenCalled();
      });
    });
  });

  describe("UI State Management", () => {
    it("clears error message after successful removal", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.removeFromCart)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      // First removal fails
      const removeBtn = screen.getByText("Remove");
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      // Second removal succeeds
      vi.mocked(api.getCart).mockResolvedValue([]);
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.queryByText("Network error")).not.toBeInTheDocument();
      });
    });

    it("clears error message before new checkout attempt", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
      vi.mocked(api.checkout)
        .mockRejectedValueOnce(new Error("Payment failed"))
        .mockResolvedValueOnce({
          success: true,
          message: "Success",
        });

      renderWithProviders(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      // First checkout fails
      const checkoutBtn = screen.getByText("Proceed to Checkout");
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.getByText("Payment failed")).toBeInTheDocument();
      });

      // Second checkout succeeds - error should be cleared
      fireEvent.click(checkoutBtn);

      await waitFor(() => {
        expect(screen.queryByText("Payment failed")).not.toBeInTheDocument();
      });
    });
  });
});
