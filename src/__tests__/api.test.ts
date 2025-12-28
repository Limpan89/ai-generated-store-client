/**
 * Unit tests for API client
 * Tests API functions with mocked fetch
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "../api/api";

// Mock fetch globally
global.fetch = vi.fn();

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("fetches products successfully", async () => {
      const mockProducts = [
        { id: 1, name: "Laptop", price: 999.99, stockQuantity: 10 },
        { id: 2, name: "Mouse", price: 29.99, stockQuantity: 50 },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const products = await api.getProducts();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products"),
        expect.objectContaining({
          headers: { Accept: "application/json" },
        })
      );
      expect(products).toEqual(mockProducts);
    });

    it("throws error on failed request", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Server error" }),
      } as Response);

      await expect(api.getProducts()).rejects.toThrow("Server error");
    });
  });

  describe("createUser", () => {
    it("creates user successfully", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const user = await api.createUser({
        username: "testuser",
        email: "test@example.com",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: "testuser",
            email: "test@example.com",
          }),
        })
      );
      expect(user).toEqual(mockUser);
    });

    it("throws error with custom message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Username already taken" }),
      } as Response);

      await expect(
        api.createUser({ username: "existing", email: "test@example.com" })
      ).rejects.toThrow("Username already taken");
    });
  });

  describe("addToCart", () => {
    it("adds item to cart successfully", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response);

      await api.addToCart(1, { productId: 2, quantity: 3 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/add?userId=1"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ productId: 2, quantity: 3 }),
        })
      );
    });

    it("throws error when product out of stock", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Insufficient stock" }),
      } as Response);

      await expect(
        api.addToCart(1, { productId: 2, quantity: 100 })
      ).rejects.toThrow("Insufficient stock");
    });
  });

  describe("checkout", () => {
    it("completes checkout successfully", async () => {
      const mockResult = {
        success: true,
        message: "Checkout completed",
        totalAmount: 150.0,
        purchasedItems: [],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      } as Response);

      const result = await api.checkout(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/checkout?userId=1"),
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("getUsers", () => {
    it("fetches all users successfully", async () => {
      const mockUsers = [
        { id: 1, username: "user1", email: "user1@example.com" },
        { id: 2, username: "user2", email: "user2@example.com" },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      } as Response);

      const users = await api.getUsers();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users"),
        expect.objectContaining({ headers: { Accept: "application/json" } })
      );
      expect(users).toEqual(mockUsers);
    });

    it("handles empty user list", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      const users = await api.getUsers();

      expect(users).toEqual([]);
    });
  });

  describe("getUserById", () => {
    it("fetches user by ID successfully", async () => {
      const mockUser = {
        id: 5,
        username: "specificuser",
        email: "specific@example.com",
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const user = await api.getUserById(5);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/5"),
        expect.objectContaining({ headers: { Accept: "application/json" } })
      );
      expect(user).toEqual(mockUser);
    });

    it("throws error when user not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "User not found" }),
      } as Response);

      await expect(api.getUserById(999)).rejects.toThrow("User not found");
    });
  });

  describe("updateUser", () => {
    it("updates user successfully", async () => {
      const updateData = { username: "updated", email: "updated@example.com" };
      const mockUpdatedUser = { id: 1, ...updateData };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUpdatedUser,
      } as Response);

      const user = await api.updateUser(1, updateData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/1"),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(updateData),
        })
      );
      expect(user).toEqual(mockUpdatedUser);
    });

    it("throws error on invalid update data", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid email format" }),
      } as Response);

      await expect(
        api.updateUser(1, { username: "test", email: "invalid" })
      ).rejects.toThrow("Invalid email format");
    });
  });

  describe("deleteUser", () => {
    it("deletes user successfully", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await api.deleteUser(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });

    it("throws error when user cannot be deleted", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "User not found" }),
      } as Response);

      await expect(api.deleteUser(999)).rejects.toThrow("User not found");
    });
  });

  describe("getProductById", () => {
    it("fetches product by ID successfully", async () => {
      const mockProduct = {
        id: 10,
        name: "Specific Product",
        description: "Product details",
        price: 199.99,
        stockQuantity: 25,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      const product = await api.getProductById(10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/10"),
        expect.objectContaining({ headers: { Accept: "application/json" } })
      );
      expect(product).toEqual(mockProduct);
    });

    it("throws error when product not found", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Product not found" }),
      } as Response);

      await expect(api.getProductById(9999)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("getCart", () => {
    it("fetches cart items successfully", async () => {
      const mockCartItems = [
        {
          id: 1,
          productId: 10,
          productName: "Product 1",
          price: 50.0,
          quantity: 2,
          subtotal: 100.0,
        },
      ];

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockCartItems,
      } as Response);

      const cart = await api.getCart(5);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart?userId=5"),
        expect.objectContaining({ headers: { Accept: "application/json" } })
      );
      expect(cart).toEqual(mockCartItems);
    });

    it("handles empty cart", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      const cart = await api.getCart(1);

      expect(cart).toEqual([]);
    });
  });

  describe("removeFromCart", () => {
    it("removes item from cart successfully", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await api.removeFromCart(1, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/remove/10?userId=1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });

    it("throws error when item not in cart", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Item not found in cart" }),
      } as Response);

      await expect(api.removeFromCart(1, 999)).rejects.toThrow(
        "Item not found in cart"
      );
    });
  });

  describe("Error Handling", () => {
    it("handles network errors", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

      await expect(api.getProducts()).rejects.toThrow("Network error");
    });

    it("handles non-JSON error responses", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as Response);

      await expect(api.getProducts()).rejects.toThrow();
    });

    it("handles 204 No Content responses", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await expect(api.deleteUser(1)).resolves.toBeUndefined();
    });
  });
});
