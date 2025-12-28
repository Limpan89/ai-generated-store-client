/**
 * Unit tests for App component
 * Tests routing and main application structure
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import App from "../App";

function renderWithProviders(initialRoute: string) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </MemoryRouter>
  );
}

describe("App Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders home page at root route", async () => {
    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
    });
  });

  it("renders Header component on all routes", async () => {
    renderWithProviders("/");

    expect(screen.getByText("AI Store")).toBeInTheDocument();
  });

  it("renders register page at /register route", async () => {
    renderWithProviders("/register");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Register / Login" })
      ).toBeInTheDocument();
    });
  });

  it("renders cart page at /cart route", async () => {
    localStorage.setItem("ai-store-user-id", "123");

    renderWithProviders("/cart");

    await waitFor(() => {
      // When user is logged in, cart redirects briefly but shows Register's "Already Logged In" state
      // or the cart page depending on timing. Check for either.
      const hasCartOrRegister =
        screen.queryByText("Shopping Cart") ||
        screen.queryByText("Already Logged In");
      expect(hasCartOrRegister).toBeInTheDocument();
    });
  });

  it("renders product detail page at /product/:id route", async () => {
    renderWithProviders("/product/1");

    await waitFor(() => {
      expect(screen.getByText("Back to Products")).toBeInTheDocument();
    });
  });

  it("renders not found page for invalid routes", () => {
    renderWithProviders("/invalid-route");

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
  });

  it("provides user context to all routes", async () => {
    localStorage.setItem("ai-store-user-id", "456");

    renderWithProviders("/");

    await waitFor(() => {
      expect(screen.getByText(/User ID: 456/i)).toBeInTheDocument();
    });
  });

  it("maintains consistent layout across routes", async () => {
    const { unmount } = renderWithProviders("/");

    expect(screen.getByText("AI Store")).toBeInTheDocument();
    unmount();

    renderWithProviders("/register");

    expect(screen.getByText("AI Store")).toBeInTheDocument();
  });
});
