/**
 * TypeScript type definitions for backend DTOs
 * These interfaces match the ASP.NET Core backend models
 */

export interface UserDto {
  id: number;
  username: string;
  email: string;
}

export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CheckoutResultDto {
  success: boolean;
  message: string;
  totalAmount?: number;
  purchasedItems?: CartItemDto[];
}

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}
