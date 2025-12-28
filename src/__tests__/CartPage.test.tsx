/**
 * Unit tests for CartPage component
 * Tests cart display, item removal, and checkout
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
  {
    id: 2,
    productId: 20,
    productName: "Mouse",
    price: 29.99,
    quantity: 2,
    subtotal: 59.98,
  },
];

describe("CartPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("redirects to register when user is not logged in", () => {
    renderWithProviders(<CartPage />);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("shows loading state initially", () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<CartPage />);

    expect(screen.getByText("Loading cart...")).toBeInTheDocument();
  });

  it("displays cart items after loading", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.getByText("Mouse")).toBeInTheDocument();
    });
  });

  it("shows empty cart message when cart is empty", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue([]);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });
  });

  it("displays start shopping button when cart is empty", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue([]);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      const shopButton = screen.getByText("Start Shopping");
      expect(shopButton).toBeInTheDocument();
      fireEvent.click(shopButton);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("calculates total correctly", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("$1059.97")).toBeInTheDocument();
    });
  });

  it("removes item from cart when remove button clicked", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart)
      .mockResolvedValueOnce(mockCartItems)
      .mockResolvedValueOnce([mockCartItems[1]]);
    vi.mocked(api.removeFromCart).mockResolvedValue(undefined);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(api.removeFromCart).toHaveBeenCalledWith(123, 10);
    });
  });

  it("shows error message when remove fails", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
    vi.mocked(api.removeFromCart).mockRejectedValue(
      new Error("Failed to remove item")
    );

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Failed to remove item")).toBeInTheDocument();
    });
  });

  it("shows checkout button when cart has items", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Proceed to Checkout")).toBeInTheDocument();
    });
  });

  it("completes checkout successfully", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
    vi.mocked(api.checkout).mockResolvedValue({
      success: true,
      message: "Order placed successfully",
      totalAmount: 1059.97,
      purchasedItems: mockCartItems,
    });

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByText("✓ Checkout Successful!")).toBeInTheDocument();
      expect(screen.getByText("Order placed successfully")).toBeInTheDocument();
      expect(screen.getByText(/Total Amount:/)).toBeInTheDocument();
    });
  });

  it("displays purchased items after successful checkout", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
    vi.mocked(api.checkout).mockResolvedValue({
      success: true,
      message: "Order placed successfully",
      totalAmount: 1059.97,
      purchasedItems: mockCartItems,
    });

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByText("Purchased Items:")).toBeInTheDocument();
    });
  });

  it("shows error when checkout fails", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
    vi.mocked(api.checkout).mockRejectedValue(new Error("Insufficient stock"));

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByText("Insufficient stock")).toBeInTheDocument();
    });
  });

  it("prevents checkout when cart is empty", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue([]);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });

    expect(screen.queryByText("Proceed to Checkout")).not.toBeInTheDocument();
  });

  it("navigates to home after successful checkout", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
    vi.mocked(api.checkout).mockResolvedValue({
      success: true,
      message: "Order placed successfully",
      totalAmount: 1059.97,
      purchasedItems: mockCartItems,
    });

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    });

    const continueButton = screen.getByText("Continue Shopping");
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("displays error on cart load failure", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockRejectedValue(new Error("Failed to load cart"));

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load cart")).toBeInTheDocument();
    });
  });

  it("displays page title", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    });
  });

  it("handles failed checkout result", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getCart).mockResolvedValue(mockCartItems);
    vi.mocked(api.checkout).mockResolvedValue({
      success: false,
      message: "Payment failed",
    });

    renderWithProviders(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText("Proceed to Checkout");
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByText("Checkout Failed")).toBeInTheDocument();
      expect(screen.getByText("Payment failed")).toBeInTheDocument();
    });
  });
});
