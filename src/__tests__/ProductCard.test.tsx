/**
 * Unit tests for ProductCard component
 * Tests product display, stock status, and add to cart
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { ProductCard } from "../components/ProductCard";
import type { ProductDto } from "../types/api";

function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <UserContextProvider>{component}</UserContextProvider>
    </BrowserRouter>
  );
}

const mockProduct: ProductDto = {
  id: 1,
  name: "Test Laptop",
  description: "A great laptop for testing purposes with many features",
  price: 999.99,
  stockQuantity: 10,
};

describe("ProductCard Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders product information correctly", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Laptop")).toBeInTheDocument();
    expect(screen.getByText("$999.99")).toBeInTheDocument();
    expect(screen.getByText("10 in stock")).toBeInTheDocument();
  });

  it("truncates long descriptions", () => {
    const longDescProduct = {
      ...mockProduct,
      description:
        "This is a very long description that should be truncated to show only the first 100 characters and then add ellipsis",
    };

    renderWithProviders(<ProductCard product={longDescProduct} />);

    const description = screen.getByText(/This is a very long description/);
    expect(description.textContent).toContain("...");
    expect(description.textContent?.length).toBeLessThan(
      longDescProduct.description.length
    );
  });

  it("shows short descriptions without truncation", () => {
    const shortDescProduct = {
      ...mockProduct,
      description: "Short description",
    };

    renderWithProviders(<ProductCard product={shortDescProduct} />);

    expect(screen.getByText("Short description")).toBeInTheDocument();
  });

  it("handles product without description", () => {
    const noDescProduct = {
      ...mockProduct,
      description: undefined,
    };

    renderWithProviders(<ProductCard product={noDescProduct} />);

    expect(screen.getByText("Test Laptop")).toBeInTheDocument();
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it("shows out of stock status when stock is zero", () => {
    const outOfStockProduct = {
      ...mockProduct,
      stockQuantity: 0,
    };

    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("disables add to cart button when out of stock", () => {
    const outOfStockProduct = {
      ...mockProduct,
      stockQuantity: 0,
    };

    localStorage.setItem("ai-store-user-id", "123");

    renderWithProviders(
      <ProductCard product={outOfStockProduct} onAddToCart={vi.fn()} />
    );

    const addButton = screen.getByRole("button", { name: /Out of Stock/i });
    expect(addButton).toBeDisabled();
  });

  it("shows Register to purchase link when user is not logged in", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Register to purchase")).toBeInTheDocument();
    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
  });

  it("shows Add to Cart button when user is logged in", () => {
    localStorage.setItem("ai-store-user-id", "123");

    renderWithProviders(
      <ProductCard product={mockProduct} onAddToCart={vi.fn()} />
    );

    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    expect(screen.queryByText("Register to purchase")).not.toBeInTheDocument();
  });

  it("calls onAddToCart with correct parameters when button clicked", () => {
    const mockAddToCart = vi.fn();
    localStorage.setItem("ai-store-user-id", "123");

    renderWithProviders(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    );

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id, 1);
  });

  it("does not call onAddToCart when user is not logged in", () => {
    const mockAddToCart = vi.fn();

    renderWithProviders(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    );

    // Should show register link, not add to cart button
    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it("has link to product detail page", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const productLink = screen
      .getByText("Test Laptop")
      .closest("a") as HTMLAnchorElement;
    expect(productLink).toHaveAttribute("href", "/product/1");
  });

  it("formats price with two decimal places", () => {
    const productWithPrice = {
      ...mockProduct,
      price: 1234.5,
    };

    renderWithProviders(<ProductCard product={productWithPrice} />);

    expect(screen.getByText("$1234.50")).toBeInTheDocument();
  });

  it("shows correct stock quantity text", () => {
    const product5Stock = {
      ...mockProduct,
      stockQuantity: 5,
    };

    renderWithProviders(<ProductCard product={product5Stock} />);

    expect(screen.getByText("5 in stock")).toBeInTheDocument();
  });
});
