/**
 * Advanced unit tests for API module
 * Focuses on error scenarios, edge cases, and network conditions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getProducts,
  getProductById,
  createUser,
  addToCart,
  getCart,
  removeFromCart,
  checkout,
} from "../api/api";

// Mock fetch globally
global.fetch = vi.fn();

describe("API Advanced Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts Error Scenarios", () => {
    it("throws error when response is not ok", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(getProducts()).rejects.toThrow();
    });

    it("throws error on network failure", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

      await expect(getProducts()).rejects.toThrow("Network error");
    });

    it("throws error when JSON parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      } as Response);

      await expect(getProducts()).rejects.toThrow("Invalid JSON");
    });

    it("handles 404 response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(getProducts()).rejects.toThrow();
    });

    it("handles 403 forbidden response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      } as Response);

      await expect(getProducts()).rejects.toThrow();
    });

    it("handles timeout error", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Request timeout"));

      await expect(getProducts()).rejects.toThrow("Request timeout");
    });

    it("handles empty response array", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      const result = await getProducts();
      expect(result).toEqual([]);
    });
  });

  describe("getProductById Error Scenarios", () => {
    it("throws error for invalid product ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Product not found",
      } as Response);

      await expect(getProductById(999)).rejects.toThrow();
    });

    it("throws error on network failure", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Connection refused"));

      await expect(getProductById(1)).rejects.toThrow("Connection refused");
    });

    it("handles null product ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      } as Response);

      await expect(getProductById(null as any)).rejects.toThrow();
    });

    it("handles negative product ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      } as Response);

      await expect(getProductById(-1)).rejects.toThrow();
    });

    it("handles zero product ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      } as Response);

      await expect(getProductById(0)).rejects.toThrow();
    });

    it("calls correct endpoint with product ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 42,
            name: "Product",
            price: 99.99,
            stockQuantity: 10,
          }),
      } as Response);

      await getProductById(42);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/42"),
        expect.any(Object)
      );
    });
  });

  describe("createUser Error Scenarios", () => {
    it("throws error when username is missing", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      } as Response);

      await expect(
        createUser({ username: "", email: "test@example.com" })
      ).rejects.toThrow();
    });

    it("throws error when email is invalid", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Invalid email format",
      } as Response);

      await expect(
        createUser({ username: "testuser", email: "invalid" })
      ).rejects.toThrow();
    });

    it("throws error when user already exists", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 409,
        statusText: "Conflict",
      } as Response);

      await expect(
        createUser({ username: "existing", email: "test@example.com" })
      ).rejects.toThrow();
    });

    it("handles server error response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(
        createUser({ username: "test", email: "test@example.com" })
      ).rejects.toThrow();
    });

    it("sends correct request body", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            username: "test",
            email: "test@example.com",
          }),
      } as Response);

      await createUser({ username: "test", email: "test@example.com" });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ username: "test", email: "test@example.com" }),
        })
      );
    });
  });

  describe("addToCart Error Scenarios", () => {
    it("throws error when user not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "User not found",
      } as Response);

      await expect(
        addToCart(999, { productId: 1, quantity: 1 })
      ).rejects.toThrow();
    });

    it("throws error when product not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Product not found",
      } as Response);

      await expect(
        addToCart(1, { productId: 999, quantity: 1 })
      ).rejects.toThrow();
    });

    it("throws error when quantity is invalid", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Invalid quantity",
      } as Response);

      await expect(
        addToCart(1, { productId: 1, quantity: 0 })
      ).rejects.toThrow();
    });

    it("throws error when quantity exceeds stock", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Insufficient stock",
      } as Response);

      await expect(
        addToCart(1, { productId: 1, quantity: 1000 })
      ).rejects.toThrow();
    });

    it("handles negative quantity", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Quantity must be positive",
      } as Response);

      await expect(
        addToCart(1, { productId: 1, quantity: -5 })
      ).rejects.toThrow();
    });

    it("sends correct request with user ID and product data", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);

      await addToCart(123, { productId: 456, quantity: 2 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/add?userId=123"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ productId: 456, quantity: 2 }),
        })
      );
    });
  });

  describe("getCart Error Scenarios", () => {
    it("throws error when user not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "User not found",
      } as Response);

      await expect(getCart(999)).rejects.toThrow();
    });

    it("returns empty array for empty cart", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      const result = await getCart(1);
      expect(result).toEqual([]);
    });

    it("handles unauthorized access", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      } as Response);

      await expect(getCart(1)).rejects.toThrow();
    });

    it("calls correct endpoint with user ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await getCart(789);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart?userId=789"),
        expect.any(Object)
      );
    });
  });

  describe("removeFromCart Error Scenarios", () => {
    it("throws error when item not in cart", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Item not found in cart",
      } as Response);

      await expect(removeFromCart(1, 999)).rejects.toThrow();
    });

    it("throws error when user not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "User not found",
      } as Response);

      await expect(removeFromCart(999, 1)).rejects.toThrow();
    });

    it("handles unauthorized removal", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      } as Response);

      await expect(removeFromCart(1, 1)).rejects.toThrow();
    });

    it("sends DELETE request to correct endpoint", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response);

      await removeFromCart(123, 456);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/remove/456?userId=123"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });

    it("handles null product ID", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      } as Response);

      await expect(removeFromCart(1, null as any)).rejects.toThrow();
    });
  });

  describe("checkout Error Scenarios", () => {
    it("throws error when cart is empty", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Cart is empty",
      } as Response);

      await expect(checkout(1)).rejects.toThrow();
    });

    it("throws error when user not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "User not found",
      } as Response);

      await expect(checkout(999)).rejects.toThrow();
    });

    it("throws error when payment fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 402,
        statusText: "Payment Required",
      } as Response);

      await expect(checkout(1)).rejects.toThrow();
    });

    it("throws error when stock unavailable during checkout", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 409,
        statusText: "Items out of stock",
      } as Response);

      await expect(checkout(1)).rejects.toThrow();
    });

    it("returns checkout result on success", async () => {
      const mockResult = {
        success: true,
        message: "Order placed",
        totalAmount: 99.99,
        purchasedItems: [],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      } as Response);

      const result = await checkout(1);
      expect(result).toEqual(mockResult);
    });

    it("sends POST request to correct endpoint", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response);

      await checkout(123);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/checkout?userId=123"),
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });

  describe("Network Conditions", () => {
    it("handles slow network for getProducts", async () => {
      vi.mocked(fetch).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve([]),
                } as Response),
              100
            )
          )
      );

      const result = await getProducts();
      expect(result).toEqual([]);
    });

    it("handles connection reset", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("ECONNRESET"));

      await expect(getProducts()).rejects.toThrow("ECONNRESET");
    });

    it("handles DNS resolution failure", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("ENOTFOUND"));

      await expect(getProducts()).rejects.toThrow("ENOTFOUND");
    });

    it("handles connection refused", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("ECONNREFUSED"));

      await expect(getProducts()).rejects.toThrow("ECONNREFUSED");
    });
  });

  describe("Content-Type Headers", () => {
    it("sets correct headers for createUser", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            username: "test",
            email: "test@example.com",
          }),
      } as Response);

      await createUser({ username: "test", email: "test@example.com" });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("sets correct headers for addToCart", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);

      await addToCart(1, { productId: 1, quantity: 1 });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("sets Accept header for checkout", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response);

      await checkout(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
          }),
        })
      );
    });
  });

  describe("API Base URL", () => {
    it("uses correct base URL for all endpoints", async () => {
      const endpoints = [
        { fn: () => getProducts(), path: "/api/products" },
        { fn: () => getProductById(1), path: "/api/products/1" },
        {
          fn: () => createUser({ username: "test", email: "test@example.com" }),
          path: "/api/users",
        },
        {
          fn: () => addToCart(1, { productId: 1, quantity: 1 }),
          path: "/api/cart/add",
        },
        { fn: () => getCart(1), path: "/api/cart" },
        { fn: () => removeFromCart(1, 1), path: "/api/cart/remove" },
        { fn: () => checkout(1), path: "/api/cart/checkout" },
      ];

      for (const endpoint of endpoints) {
        vi.mocked(fetch).mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);

        try {
          await endpoint.fn();
        } catch {
          // Ignore errors
        }

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(endpoint.path),
          expect.any(Object)
        );

        vi.clearAllMocks();
      }
    });
  });

  describe("Response Data Types", () => {
    it("returns array for getProducts", async () => {
      const mockProducts = [
        { id: 1, name: "Product", price: 10, stockQuantity: 5 },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response);

      const result = await getProducts();
      expect(Array.isArray(result)).toBe(true);
    });

    it("returns object for getProductById", async () => {
      const mockProduct = {
        id: 1,
        name: "Product",
        price: 10,
        stockQuantity: 5,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      } as Response);

      const result = await getProductById(1);
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("id");
    });

    it("returns user object for createUser", async () => {
      const mockUser = { id: 1, username: "test", email: "test@example.com" };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser),
      } as Response);

      const result = await createUser({
        username: "test",
        email: "test@example.com",
      });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("username");
    });
  });
});
