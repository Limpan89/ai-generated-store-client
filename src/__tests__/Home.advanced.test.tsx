/**
 * Advanced unit tests for Home component
 * Focuses on edge cases, error handling, and retry mechanisms
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { Home } from "../pages/Home";
import * as api from "../api/api";

vi.mock("../api/api");

function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <UserContextProvider>{component}</UserContextProvider>
    </BrowserRouter>
  );
}

const mockProducts = [
  {
    id: 1,
    name: "Laptop",
    description: "Gaming laptop",
    price: 999.99,
    stockQuantity: 10,
  },
  {
    id: 2,
    name: "Mouse",
    description: "Wireless mouse",
    price: 29.99,
    stockQuantity: 50,
  },
];

describe("Home Advanced Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Error Handling and Retry", () => {
    it("shows error message when products fail to load", async () => {
      vi.mocked(api.getProducts).mockRejectedValue(
        new Error("Network connection failed")
      );

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(
          screen.getByText("Network connection failed")
        ).toBeInTheDocument();
      });
    });

    it("shows error with unknown error type", async () => {
      vi.mocked(api.getProducts).mockRejectedValue("Unknown error string");

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load products")).toBeInTheDocument();
      });
    });

    it("shows error with null error", async () => {
      vi.mocked(api.getProducts).mockRejectedValue(null);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Failed to load products")).toBeInTheDocument();
      });
    });

    it("displays retry button when products fail to load", async () => {
      vi.mocked(api.getProducts).mockRejectedValue(new Error("Server timeout"));

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Retry")).toBeInTheDocument();
      });
    });

    it("retries loading products when retry button is clicked", async () => {
      vi.mocked(api.getProducts)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(mockProducts);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      const retryBtn = screen.getByText("Retry");
      fireEvent.click(retryBtn);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Mouse")).toBeInTheDocument();
      });
    });

    it("clears error message before retry", async () => {
      vi.mocked(api.getProducts)
        .mockRejectedValueOnce(new Error("First error"))
        .mockRejectedValueOnce(new Error("Second error"));

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First error")).toBeInTheDocument();
      });

      const retryBtn = screen.getByText("Retry");
      fireEvent.click(retryBtn);

      await waitFor(() => {
        expect(screen.queryByText("First error")).not.toBeInTheDocument();
        expect(screen.getByText("Second error")).toBeInTheDocument();
      });
    });

    it("handles multiple retry attempts", async () => {
      vi.mocked(api.getProducts)
        .mockRejectedValueOnce(new Error("Error 1"))
        .mockRejectedValueOnce(new Error("Error 2"))
        .mockResolvedValueOnce(mockProducts);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Error 1")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Retry"));

      await waitFor(() => {
        expect(screen.getByText("Error 2")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Retry"));

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });
    });
  });

  describe("Add to Cart Error Scenarios", () => {
    it("shows error when add to cart fails with Error instance", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockRejectedValue(
        new Error("Product out of stock")
      );

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText("Add to Cart");
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Product out of stock")).toBeInTheDocument();
      });
    });

    it("shows error when add to cart fails with unknown error", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockRejectedValue({ status: 500 });

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText("Add to Cart");
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Failed to add to cart")).toBeInTheDocument();
      });
    });

    it("shows error when add to cart fails with network timeout", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockRejectedValue(
        new Error("Request timeout after 30s")
      );

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText("Add to Cart");
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Request timeout after 30s")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Message Display and Timeout", () => {
    it("shows success message when item added to cart", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText("Add to Cart");
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Item added to cart!")).toBeInTheDocument();
      });
    });
  });

  describe("Empty States", () => {
    it("shows empty message when no products available", async () => {
      vi.mocked(api.getProducts).mockResolvedValue([]);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("No products available")).toBeInTheDocument();
      });
    });

    it("does not show product grid when no products", async () => {
      vi.mocked(api.getProducts).mockResolvedValue([]);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("No products available")).toBeInTheDocument();
      });

      expect(screen.queryByRole("article")).not.toBeInTheDocument();
    });
  });

  describe("Product Display", () => {
    it("displays all products in grid", async () => {
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Mouse")).toBeInTheDocument();
      });
    });

    it("displays large number of products", async () => {
      const manyProducts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        description: `Description ${i + 1}`,
        price: 10.99 * (i + 1),
        stockQuantity: 10,
      }));

      vi.mocked(api.getProducts).mockResolvedValue(manyProducts);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Product 1")).toBeInTheDocument();
        expect(screen.getByText("Product 20")).toBeInTheDocument();
      });
    });

    it("handles products with zero stock", async () => {
      vi.mocked(api.getProducts).mockResolvedValue([
        {
          id: 1,
          name: "Out of Stock Item",
          description: "Not available",
          price: 99.99,
          stockQuantity: 0,
        },
      ]);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Out of Stock Item")).toBeInTheDocument();
      });
    });

    it("handles products with very high stock", async () => {
      vi.mocked(api.getProducts).mockResolvedValue([
        {
          id: 1,
          name: "Popular Item",
          description: "In stock",
          price: 49.99,
          stockQuantity: 99999,
        },
      ]);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Popular Item")).toBeInTheDocument();
      });
    });
  });

  describe("Add to Cart with Quantity", () => {
    it("adds product with default quantity of 1", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText("Add to Cart");
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(api.addToCart).toHaveBeenCalledWith(123, {
          productId: 1,
          quantity: 1,
        });
      });
    });

    it("handles rapid multiple additions", async () => {
      localStorage.setItem("ai-store-user-id", "123");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButton = screen.getAllByText("Add to Cart")[0];

      // Click rapidly 3 times
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(api.addToCart).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe("Loading State Management", () => {
    it("shows loading before products are fetched", async () => {
      vi.mocked(api.getProducts).mockImplementation(
        () => new Promise(() => {})
      );

      renderWithProviders(<Home />);

      expect(screen.getByText("Loading products...")).toBeInTheDocument();
    });

    it("hides loading after products are loaded", async () => {
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading products...")
        ).not.toBeInTheDocument();
      });
    });

    it("hides loading after error occurs", async () => {
      vi.mocked(api.getProducts).mockRejectedValue(new Error("Error"));

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading products...")
        ).not.toBeInTheDocument();
      });
    });

    it("shows loading during retry", async () => {
      vi.mocked(api.getProducts)
        .mockRejectedValueOnce(new Error("Error"))
        .mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Retry")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Retry"));

      expect(screen.getByText("Loading products...")).toBeInTheDocument();
    });
  });

  describe("User Context Integration", () => {
    it("uses user ID from context when adding to cart", async () => {
      localStorage.setItem("ai-store-user-id", "456");
      vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
      vi.mocked(api.addToCart).mockResolvedValue();

      renderWithProviders(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText("Add to Cart");
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(api.addToCart).toHaveBeenCalledWith(456, {
          productId: 1,
          quantity: 1,
        });
      });
    });
  });
});
