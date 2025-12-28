/**
 * Unit tests for UserContext
 * Tests context provider, localStorage persistence, and hooks
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { UserContextProvider, useUser } from "../context/UserContext";

describe("UserContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("provides initial null userId", () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserContextProvider,
    });

    expect(result.current.currentUserId).toBeNull();
  });

  it("sets user ID and persists to localStorage", () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserContextProvider,
    });

    act(() => {
      result.current.setCurrentUserId(123);
    });

    expect(result.current.currentUserId).toBe(123);
    expect(localStorage.getItem("ai-store-user-id")).toBe("123");
  });

  it("loads user ID from localStorage on mount", () => {
    localStorage.setItem("ai-store-user-id", "456");

    const { result } = renderHook(() => useUser(), {
      wrapper: UserContextProvider,
    });

    // Give time for useEffect to run
    expect(result.current.currentUserId).toBe(456);
  });

  it("clears user ID and removes from localStorage", () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserContextProvider,
    });

    act(() => {
      result.current.setCurrentUserId(789);
    });

    expect(result.current.currentUserId).toBe(789);
    expect(localStorage.getItem("ai-store-user-id")).toBe("789");

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.currentUserId).toBeNull();
    expect(localStorage.getItem("ai-store-user-id")).toBeNull();
  });

  it("handles invalid localStorage values gracefully", () => {
    localStorage.setItem("ai-store-user-id", "not-a-number");

    const { result } = renderHook(() => useUser(), {
      wrapper: UserContextProvider,
    });

    expect(result.current.currentUserId).toBeNull();
  });

  it("throws error when useUser is called outside provider", () => {
    expect(() => {
      renderHook(() => useUser());
    }).toThrow("useUser must be used within a UserContextProvider");
  });

  it("allows setting null userId", () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserContextProvider,
    });

    act(() => {
      result.current.setCurrentUserId(100);
    });

    expect(result.current.currentUserId).toBe(100);

    act(() => {
      result.current.setCurrentUserId(null);
    });

    expect(result.current.currentUserId).toBeNull();
    expect(localStorage.getItem("ai-store-user-id")).toBeNull();
  });
});
