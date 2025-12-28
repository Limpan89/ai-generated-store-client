/**
 * Unit tests for ProductDetail page component
 * Tests product detail display, quantity selection, and add to cart
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
  description: "High-performance gaming laptop with RGB keyboard",
  price: 1499.99,
  stockQuantity: 5,
};

describe("ProductDetail Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows loading state initially", () => {
    vi.mocked(api.getProductById).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProviders();

    expect(screen.getByText("Loading product...")).toBeInTheDocument();
  });

  it("displays product details after loading", async () => {
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
      expect(screen.getByText("$1499.99")).toBeInTheDocument();
      expect(screen.getByText("5 available")).toBeInTheDocument();
      expect(
        screen.getByText("High-performance gaming laptop with RGB keyboard")
      ).toBeInTheDocument();
    });
  });

  it("displays error on API failure", async () => {
    vi.mocked(api.getProductById).mockRejectedValue(
      new Error("Product not found")
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Product not found")).toBeInTheDocument();
    });
  });

  it("shows back to products button", async () => {
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("← Back to Products")).toBeInTheDocument();
    });
  });

  it("navigates back when back button clicked", async () => {
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("← Back to Products")).toBeInTheDocument();
    });

    const backButton = screen.getByText("← Back to Products");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows out of stock status when stock is zero", async () => {
    vi.mocked(api.getProductById).mockResolvedValue({
      ...mockProduct,
      stockQuantity: 0,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    });
  });

  it("disables add to cart when out of stock", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue({
      ...mockProduct,
      stockQuantity: 0,
    });

    renderWithProviders();

    await waitFor(() => {
      const addButton = screen.getByRole("button", { name: /Out of Stock/i });
      expect(addButton).toBeDisabled();
    });
  });

  it("allows quantity input when logged in", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      const quantityInput = screen.getByLabelText("Quantity:");
      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveValue(1);
    });
  });

  it("updates quantity when input changes", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      const quantityInput = screen.getByLabelText(
        "Quantity:"
      ) as HTMLInputElement;
      fireEvent.change(quantityInput, { target: { value: "3" } });
      expect(quantityInput.value).toBe("3");
    });
  });

  it("adds product to cart with correct quantity", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
    vi.mocked(api.addToCart).mockResolvedValue(undefined);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    });

    const quantityInput = screen.getByLabelText("Quantity:");
    fireEvent.change(quantityInput, { target: { value: "2" } });

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(api.addToCart).toHaveBeenCalledWith(123, {
        productId: 1,
        quantity: 2,
      });
    });
  });

  it("shows success message after adding to cart", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);
    vi.mocked(api.addToCart).mockResolvedValue(undefined);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    });

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Item added to cart!")).toBeInTheDocument();
    });
  });

  it("validates quantity is positive", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    });

    const quantityInput = screen.getByLabelText("Quantity:");
    fireEvent.change(quantityInput, { target: { value: "0" } });

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText(
        "Quantity must be greater than 0"
      );
      expect(errorMessage).toBeInTheDocument();
    });

    // Ensure addToCart was not called
    expect(api.addToCart).not.toHaveBeenCalled();
  });

  it("validates quantity does not exceed stock", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    });

    const quantityInput = screen.getByLabelText("Quantity:");
    fireEvent.change(quantityInput, { target: { value: "10" } });

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Only 5 items available in stock/i)
      ).toBeInTheDocument();
    });
  });

  it("prompts to register when not logged in", async () => {
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByText("Please register or login to purchase this product")
      ).toBeInTheDocument();
    });
  });

  it("navigates to register page when register button clicked", async () => {
    vi.mocked(api.getProductById).mockResolvedValue(mockProduct);

    renderWithProviders();

    await waitFor(() => {
      const registerButton = screen.getByText("Register / Login");
      fireEvent.click(registerButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("handles product without description", async () => {
    vi.mocked(api.getProductById).mockResolvedValue({
      ...mockProduct,
      description: undefined,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Gaming Laptop")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("High-performance gaming laptop")
    ).not.toBeInTheDocument();
  });
});
