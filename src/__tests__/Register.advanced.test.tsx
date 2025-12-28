/**
 * Advanced unit tests for Register component
 * Focuses on validation, error handling, and edge cases
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { Register } from "../pages/Register";
import * as api from "../api/api";

vi.mock("../api/api");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <UserContextProvider>{component}</UserContextProvider>
    </BrowserRouter>
  );
}

describe("Register Advanced Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Email Validation Edge Cases", () => {
    it("accepts valid email despite browser validation", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "test",
        email: "test@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalled();
      });
    });

    it("shows error for email without TLD", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "test",
        email: "test@domain",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@domain" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address")
        ).toBeInTheDocument();
      });
    });

    it("accepts valid email with subdomain", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "test",
        email: "test@mail.example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, {
        target: { value: "test@mail.example.com" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalled();
      });
    });

    it("accepts valid email with plus sign", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "test",
        email: "test+tag@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, {
        target: { value: "test+tag@example.com" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalled();
      });
    });

    it("accepts valid email with numbers", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "test",
        email: "test123@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, {
        target: { value: "test123@example.com" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalled();
      });
    });
  });

  describe("Username Validation Edge Cases", () => {
    it("shows error for empty username", async () => {
      renderWithProviders(<Register />);

      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Username is required")).toBeInTheDocument();
      });
    });

    it("shows error for whitespace-only username", async () => {
      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "   " } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Username is required")).toBeInTheDocument();
      });
    });

    it("shows error for tab-only username", async () => {
      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "\t\t" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Username is required")).toBeInTheDocument();
      });
    });

    it("trims whitespace from username", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "  testuser  " } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
        });
      });
    });
  });

  describe("Email Input Edge Cases", () => {
    it("shows error for empty email", async () => {
      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });

    it("shows error for whitespace-only email", async () => {
      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "   " } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });

    it("trims whitespace from email", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, {
        target: { value: "  test@example.com  " },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
        });
      });
    });
  });

  describe("API Error Handling", () => {
    it("shows error when API returns Error instance", async () => {
      vi.mocked(api.createUser).mockRejectedValue(
        new Error("Username already exists")
      );

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Username already exists")).toBeInTheDocument();
      });
    });

    it("shows error when API returns unknown error", async () => {
      vi.mocked(api.createUser).mockRejectedValue({ status: 500 });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to create user")).toBeInTheDocument();
      });
    });

    it("shows error when API returns null", async () => {
      vi.mocked(api.createUser).mockRejectedValue(null);

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to create user")).toBeInTheDocument();
      });
    });

    it("shows error for network timeout", async () => {
      vi.mocked(api.createUser).mockRejectedValue(
        new Error("Network request timeout")
      );

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Network request timeout")).toBeInTheDocument();
      });
    });

    it("shows error for email already in use", async () => {
      vi.mocked(api.createUser).mockRejectedValue(
        new Error("Email already registered")
      );

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Email already registered")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Logged In State", () => {
    it("shows logged in message when user is already logged in", () => {
      localStorage.setItem("ai-store-user-id", "123");

      renderWithProviders(<Register />);

      expect(screen.getByText("Already Logged In")).toBeInTheDocument();
      expect(
        screen.getByText("You are currently logged in as User ID: 123")
      ).toBeInTheDocument();
    });

    it("navigates to home when Go to Products clicked", () => {
      localStorage.setItem("ai-store-user-id", "123");

      renderWithProviders(<Register />);

      const homeButton = screen.getByText("Go to Products");
      fireEvent.click(homeButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to cart when View Cart clicked", () => {
      localStorage.setItem("ai-store-user-id", "123");

      renderWithProviders(<Register />);

      const cartButton = screen.getByText("View Cart");
      fireEvent.click(cartButton);

      expect(mockNavigate).toHaveBeenCalledWith("/cart");
    });

    it("displays both navigation buttons when logged in", () => {
      localStorage.setItem("ai-store-user-id", "123");

      renderWithProviders(<Register />);

      expect(screen.getByText("Go to Products")).toBeInTheDocument();
      expect(screen.getByText("View Cart")).toBeInTheDocument();
    });

    it("does not show registration form when logged in", () => {
      localStorage.setItem("ai-store-user-id", "123");

      renderWithProviders(<Register />);

      expect(screen.queryByLabelText("Username")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
      expect(screen.queryByText("Register")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("disables form during submission", async () => {
      vi.mocked(api.createUser).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Creating Account...")).toBeInTheDocument();
      });

      expect(usernameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(screen.getByText("Creating Account...")).toBeDisabled();
    });

    it("re-enables form after successful submission", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("re-enables form after error", async () => {
      vi.mocked(api.createUser).mockRejectedValue(new Error("Server error"));

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });

      expect(usernameInput).not.toBeDisabled();
      expect(emailInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Submission", () => {
    it("clears error before new submission", async () => {
      vi.mocked(api.createUser)
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce({
          id: 1,
          username: "testuser",
          email: "test@example.com",
        });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      // First submission
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("First error")).toBeInTheDocument();
      });

      // Second submission
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText("First error")).not.toBeInTheDocument();
      });
    });

    it("prevents submission when validation fails", async () => {
      renderWithProviders(<Register />);

      const submitButton = screen.getByText("Register");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Username is required")).toBeInTheDocument();
      });

      expect(api.createUser).not.toHaveBeenCalled();
    });

    it("navigates to home after successful registration", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 42,
        username: "newuser",
        email: "new@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "newuser" } });
      fireEvent.change(emailInput, { target: { value: "new@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("stores user ID after successful registration", async () => {
      vi.mocked(api.createUser).mockResolvedValue({
        id: 999,
        username: "testuser",
        email: "test@example.com",
      });

      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByText("Register");

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem("ai-store-user-id")).toBe("999");
      });
    });
  });

  describe("Input Changes", () => {
    it("updates username on input change", () => {
      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText(
        "Username"
      ) as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: "myusername" } });

      expect(usernameInput.value).toBe("myusername");
    });

    it("updates email on input change", () => {
      renderWithProviders(<Register />);

      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: "my@email.com" } });

      expect(emailInput.value).toBe("my@email.com");
    });

    it("allows changing username multiple times", () => {
      renderWithProviders(<Register />);

      const usernameInput = screen.getByLabelText(
        "Username"
      ) as HTMLInputElement;

      fireEvent.change(usernameInput, { target: { value: "first" } });
      expect(usernameInput.value).toBe("first");

      fireEvent.change(usernameInput, { target: { value: "second" } });
      expect(usernameInput.value).toBe("second");

      fireEvent.change(usernameInput, { target: { value: "third" } });
      expect(usernameInput.value).toBe("third");
    });
  });
});
