/**
 * Advanced unit tests for ProductDetail component
 * Focuses on edge cases, quantity validation, and navigation scenarios
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { ProductDetail } from "../pages/ProductDetail";
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

function renderWithProviders(initialRoute = "/product/1") {
  window.history.pushState({}, "Test", initialRoute);

  return render(
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

const mockProduct = {
  id: 1,
  name: "Gaming Laptop",
  description: "High-performance laptop",
  price: 1499.99,
  stockQuantity: 5,
};

describe("ProductDetail Advanced Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Quantity Validation Edge Cases", () => {
    it("shows error when quantity is zero", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "0" } });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Quantity must be greater than 0")
        ).toBeInTheDocument();
      });
    });

    it("shows error when quantity is negative", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "-5" } });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Quantity must be greater than 0")
        ).toBeInTheDocument();
      });
    });

    it("shows error when quantity exceeds stock", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "10" } });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Only 5 items available in stock")
        ).toBeInTheDocument();
      });
    });

    it("shows error when quantity exceeds stock by 1", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "6" } });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Only 5 items available in stock")
        ).toBeInTheDocument();
      });
    });

    it("allows adding exactly the stock quantity", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "5" } });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Item added to cart!")).toBeInTheDocument();
      });

      expect(api.addToCart).toHaveBeenCalledWith(123, {
        productId: 1,
        quantity: 5,
      });
    });

    it("handles NaN quantity input", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "abc" } });

      // Should default to 1
      expect(quantityInput).toHaveValue(1);
    });

    it("handles empty quantity input", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "" } });

      // Should default to 1
      expect(quantityInput).toHaveValue(1);
    });

    it("handles decimal quantity input", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "2.5" } });

      // Should parse as 2
      expect(quantityInput).toHaveValue(2);
    });
  });

  describe("Navigation and Redirect Scenarios", () => {
    it("navigates back to home when back button clicked", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const backButton = screen.getByText("← Back to Products");
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates back when product not found", async () => {
      vi.mocked(api.getProductById).mockRejectedValue(
        new Error("Product not found")
      );

      renderWithProviders("/product/999");

      await waitFor(() => {
        expect(screen.getByText("Product not found")).toBeInTheDocument();
      });

      const backButton = screen.getByText("Back to Products");
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to register when register button clicked", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const registerButton = screen.getByText("Register / Login");
      fireEvent.click(registerButton);

      expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
  });

  describe("Product Loading Edge Cases", () => {
    it("handles product not found error", async () => {
      vi.mocked(api.getProductById).mockRejectedValue(
        new Error("Product with ID 999 not found")
      );

      renderWithProviders("/product/999");

      await waitFor(() => {
        expect(
          screen.getByText("Product with ID 999 not found")
        ).toBeInTheDocument();
      });
    });

    it("shows generic error when product is null", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(null as any);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Product not found")).toBeInTheDocument();
      });
    });

    it("handles network error", async () => {
      vi.mocked(api.getProductById).mockRejectedValue(
        new Error("Network connection failed")
      );

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(
          screen.getByText("Network connection failed")
        ).toBeInTheDocument();
      });
    });

    it("handles unknown error type", async () => {
      vi.mocked(api.getProductById).mockRejectedValue({ code: 500 });

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Failed to load product")).toBeInTheDocument();
      });
    });

    it("loads product with invalid route param", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/abc");

      await waitFor(() => {
        expect(api.getProductById).toHaveBeenCalledWith(NaN);
      });
    });
  });

  describe("Add to Cart Error Handling", () => {
    it("shows error when add to cart fails", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
      vi.mocked(api.addToCart).mockRejectedValue(
        new Error("Server error occurred")
      );

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Server error occurred")).toBeInTheDocument();
      });
    });

    it("shows error when add to cart fails with unknown error", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
      vi.mocked(api.addToCart).mockRejectedValue(null);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to add to cart")).toBeInTheDocument();
      });
    });

    it("clears previous message before adding to cart", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      // First add with invalid quantity
      const quantityInput = screen.getByLabelText("Quantity:");
      fireEvent.change(quantityInput, { target: { value: "0" } });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Quantity must be greater than 0")
        ).toBeInTheDocument();
      });

      // Second add with valid quantity
      fireEvent.change(quantityInput, { target: { value: "1" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Quantity must be greater than 0")
        ).not.toBeInTheDocument();
        expect(screen.getByText("Item added to cart!")).toBeInTheDocument();
      });
    });
  });

  describe("Out of Stock Scenarios", () => {
    it("displays out of stock message", async () => {
      vi.mocked(api.getProductById).mockResolvedValue({
        ...mockProduct,
        stockQuantity: 0,
      });

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Out of Stock")).toBeInTheDocument();
      });
    });

    it("disables add to cart button when out of stock", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue({
        ...mockProduct,
        stockQuantity: 0,
      });

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /out of stock/i });
      expect(addButton).toBeDisabled();
    });

    it("disables quantity input when out of stock", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue({
        ...mockProduct,
        stockQuantity: 0,
      });

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const quantityInput = screen.getByLabelText("Quantity:");
      expect(quantityInput).toBeDisabled();
    });

    it("does not call API when clicking disabled button", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue({
        ...mockProduct,
        stockQuantity: 0,
      });
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /out of stock/i });
      fireEvent.click(addButton);

      // API should not be called
      expect(api.addToCart).not.toHaveBeenCalled();
    });
  });

  describe("Success Message Display", () => {
    it("shows success message after adding to cart", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Item added to cart!")).toBeInTheDocument();
      });
    });
  });

  describe("Product Details Display", () => {
    it("displays product with description", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
        expect(screen.getByText("High-performance laptop")).toBeInTheDocument();
      });
    });

    it("handles product without description", async () => {
      vi.mocked(api.getProductById).mockResolvedValue({
        ...mockProduct,
        description: undefined,
      });

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      // Description should not be rendered
      expect(
        screen.queryByText("High-performance laptop")
      ).not.toBeInTheDocument();
    });

    it("displays correct stock availability message", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("5 available")).toBeInTheDocument();
      });
    });

    it("displays stock for single item", async () => {
      vi.mocked(api.getProductById).mockResolvedValue({
        ...mockProduct,
        stockQuantity: 1,
      });

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("1 available")).toBeInTheDocument();
      });
    });

    it("displays formatted price", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("$1499.99")).toBeInTheDocument();
      });
    });
  });

  describe("User Context Edge Cases", () => {
    it("shows login prompt when not authenticated", async () => {
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      expect(
        screen.getByText("Please register or login to purchase this product")
      ).toBeInTheDocument();
    });

    it("shows add to cart form when authenticated", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

      renderWithProviders("/product/1");

      await waitFor(() => {
        expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("Quantity:")).toBeInTheDocument();
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });
  });
});
