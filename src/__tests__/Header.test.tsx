/**
 * Unit tests for Header component
 * Tests navigation, user status display, and logout
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { Header } from "../components/Header";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper component with all providers
function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <UserContextProvider>{component}</UserContextProvider>
    </BrowserRouter>
  );
}

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders header with logo and navigation", () => {
    renderWithProviders(<Header />);

    expect(screen.getByText("AI Store")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("shows Register/Login link when user is not logged in", () => {
    renderWithProviders(<Header />);

    expect(screen.getByText("Register / Login")).toBeInTheDocument();
    expect(screen.queryByText("Cart")).not.toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("shows Cart link and user info when user is logged in", () => {
    localStorage.setItem("ai-store-user-id", "123");

    renderWithProviders(<Header />);

    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText(/User ID: 123/i)).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Register / Login")).not.toBeInTheDocument();
  });

  it("clears user on logout button click", () => {
    localStorage.setItem("ai-store-user-id", "456");

    renderWithProviders(<Header />);

    expect(screen.getByText(/User ID: 456/i)).toBeInTheDocument();

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("ai-store-user-id")).toBeNull();
  });

  it("has working navigation links", () => {
    renderWithProviders(<Header />);

    const productsLink = screen.getByText("Products");
    expect(productsLink).toHaveAttribute("href", "/");

    const logoLink = screen.getByText("AI Store").closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("shows cart link with correct href when logged in", () => {
    localStorage.setItem("ai-store-user-id", "789");

    renderWithProviders(<Header />);

    const cartLink = screen.getByText("Cart");
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("shows register link with correct href when not logged in", () => {
    renderWithProviders(<Header />);

    const registerLink = screen.getByText("Register / Login");
    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
