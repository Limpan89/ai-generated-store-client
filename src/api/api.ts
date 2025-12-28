/**
 * API client for AIGeneratedStore backend
 * Uses fetch API with typed responses and error handling
 * Configure base URL via VITE_API_BASE_URL environment variable
 */

import type {
  UserDto,
  ProductDto,
  CartItemDto,
  AddToCartRequest,
  CheckoutResultDto,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/api";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Generic response handler that parses JSON and throws on errors
 * Attempts to extract error message from JSON response body
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    // Handle 204 No Content
    if (res.status === 204) {
      return undefined as T;
    }
    return res.json() as Promise<T>;
  }

  // Try to parse error message from JSON body
  let err = res.statusText;
  try {
    const body = await res.json();
    if (body?.message) {
      err = body.message;
    }
  } catch {
    // Failed to parse JSON, use status text
  }
  throw new Error(err || `HTTP ${res.status}`);
}

// ============================================================================
// User API
// ============================================================================

/**
 * Create a new user
 * POST /api/users
 */
export async function createUser(dto: CreateUserRequest): Promise<UserDto> {
  const res = await fetch(`${BASE}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<UserDto>(res);
}

/**
 * Get all users
 * GET /api/users
 */
export async function getUsers(): Promise<UserDto[]> {
  const res = await fetch(`${BASE}/api/users`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse<UserDto[]>(res);
}

/**
 * Get user by ID
 * GET /api/users/{id}
 */
export async function getUserById(id: number): Promise<UserDto> {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse<UserDto>(res);
}

/**
 * Update user
 * PUT /api/users/{id}
 */
export async function updateUser(
  id: number,
  dto: UpdateUserRequest
): Promise<UserDto> {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<UserDto>(res);
}

/**
 * Delete user
 * DELETE /api/users/{id}
 */
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(res);
}

// ============================================================================
// Product API
// ============================================================================

/**
 * Get all products
 * GET /api/products
 */
export async function getProducts(): Promise<ProductDto[]> {
  const res = await fetch(`${BASE}/api/products`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse<ProductDto[]>(res);
}

/**
 * Get product by ID
 * GET /api/products/{id}
 */
export async function getProductById(id: number): Promise<ProductDto> {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse<ProductDto>(res);
}

// ============================================================================
// Cart API
// All cart endpoints require userId query parameter
// ============================================================================

/**
 * Get cart items for user
 * GET /api/cart?userId={userId}
 */
export async function getCart(userId: number): Promise<CartItemDto[]> {
  const res = await fetch(`${BASE}/api/cart?userId=${userId}`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse<CartItemDto[]>(res);
}

/**
 * Add item to cart
 * POST /api/cart/add?userId={userId}
 * Body: { productId, quantity }
 */
export async function addToCart(
  userId: number,
  request: AddToCartRequest
): Promise<void> {
  const res = await fetch(`${BASE}/api/cart/add?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });
  return handleResponse<void>(res);
}

/**
 * Remove item from cart
 * DELETE /api/cart/remove/{productId}?userId={userId}
 */
export async function removeFromCart(
  userId: number,
  productId: number
): Promise<void> {
  const res = await fetch(
    `${BASE}/api/cart/remove/${productId}?userId=${userId}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse<void>(res);
}

/**
 * Checkout cart
 * POST /api/cart/checkout?userId={userId}
 * Returns CheckoutResultDto with success status and total amount
 */
export async function checkout(userId: number): Promise<CheckoutResultDto> {
  const res = await fetch(`${BASE}/api/cart/checkout?userId=${userId}`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  return handleResponse<CheckoutResultDto>(res);
}
