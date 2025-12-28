/**
 * Unit tests for Home page component
 * Tests product list display, loading states, and add to cart
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
    description: "Great laptop",
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

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows loading state initially", () => {
    vi.mocked(api.getProducts).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<Home />);

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("displays products after loading", async () => {
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.getByText("Mouse")).toBeInTheDocument();
    });
  });

  it("displays error message on API failure", async () => {
    vi.mocked(api.getProducts).mockRejectedValue(
      new Error("Failed to load products")
    );

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load products")).toBeInTheDocument();
    });
  });

  it("shows retry button on error", async () => {
    vi.mocked(api.getProducts).mockRejectedValue(new Error("Network error"));

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  it("retries loading products when retry button clicked", async () => {
    vi.mocked(api.getProducts)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockProducts);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });
  });

  it("shows empty state when no products available", async () => {
    vi.mocked(api.getProducts).mockResolvedValue([]);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("No products available")).toBeInTheDocument();
    });
  });

  it("adds product to cart when logged in", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(api.addToCart).mockResolvedValue(undefined);

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

  it("shows success message after adding to cart", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(api.addToCart).mockResolvedValue(undefined);

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

  it("shows error message when add to cart fails", async () => {
    localStorage.setItem("ai-store-user-id", "123");
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(api.addToCart).mockRejectedValue(new Error("Insufficient stock"));

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Insufficient stock")).toBeInTheDocument();
    });
  });

  it("prompts user to register when not logged in", async () => {
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    // Should show "Register to purchase" instead of "Add to Cart"
    expect(screen.getAllByText("Register to purchase").length).toBeGreaterThan(
      0
    );
  });

  it("displays page title", async () => {
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
    });
  });

  it("renders product grid with multiple products", async () => {
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.getByText("Mouse")).toBeInTheDocument();
    });
  });

  it("calls getProducts on mount", async () => {
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(api.getProducts).toHaveBeenCalledTimes(1);
    });
  });
});
