/**
 * Unit tests for CartItem component
 * Tests cart item display and remove functionality
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartItem } from "../components/CartItem";
import type { CartItemDto } from "../types/api";

const mockCartItem: CartItemDto = {
  id: 1,
  productId: 10,
  productName: "Test Product",
  price: 49.99,
  quantity: 2,
  subtotal: 99.98,
};

describe("CartItem Component", () => {
  it("renders cart item information correctly", () => {
    const mockRemove = vi.fn();

    render(<CartItem item={mockCartItem} onRemove={mockRemove} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Price: $49.99")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("$99.98")).toBeInTheDocument();
  });

  it("formats prices with two decimal places", () => {
    const itemWithDecimals: CartItemDto = {
      ...mockCartItem,
      price: 12.5,
      subtotal: 25.0,
    };

    const mockRemove = vi.fn();

    render(<CartItem item={itemWithDecimals} onRemove={mockRemove} />);

    expect(screen.getByText("Price: $12.50")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("displays correct quantity", () => {
    const itemWithQuantity: CartItemDto = {
      ...mockCartItem,
      quantity: 5,
      subtotal: 249.95,
    };

    const mockRemove = vi.fn();

    render(<CartItem item={itemWithQuantity} onRemove={mockRemove} />);

    expect(screen.getByText("Quantity: 5")).toBeInTheDocument();
  });

  it("calls onRemove with product ID when Remove button clicked", () => {
    const mockRemove = vi.fn();

    render(<CartItem item={mockCartItem} onRemove={mockRemove} />);

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith(mockCartItem.productId);
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it("renders remove button", () => {
    const mockRemove = vi.fn();

    render(<CartItem item={mockCartItem} onRemove={mockRemove} />);

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
  });

  it("displays subtotal label", () => {
    const mockRemove = vi.fn();

    render(<CartItem item={mockCartItem} onRemove={mockRemove} />);

    expect(screen.getByText("Subtotal:")).toBeInTheDocument();
  });

  it("handles single quantity items", () => {
    const singleItem: CartItemDto = {
      ...mockCartItem,
      quantity: 1,
      subtotal: 49.99,
    };

    const mockRemove = vi.fn();

    render(<CartItem item={singleItem} onRemove={mockRemove} />);

    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("handles high quantity items", () => {
    const highQuantityItem: CartItemDto = {
      ...mockCartItem,
      quantity: 100,
      subtotal: 4999.0,
    };

    const mockRemove = vi.fn();

    render(<CartItem item={highQuantityItem} onRemove={mockRemove} />);

    expect(screen.getByText("Quantity: 100")).toBeInTheDocument();
    expect(screen.getByText("$4999.00")).toBeInTheDocument();
  });

  it("renders product name as heading", () => {
    const mockRemove = vi.fn();

    render(<CartItem item={mockCartItem} onRemove={mockRemove} />);

    const productHeading = screen.getByRole("heading", {
      name: "Test Product",
    });
    expect(productHeading).toBeInTheDocument();
  });
});
