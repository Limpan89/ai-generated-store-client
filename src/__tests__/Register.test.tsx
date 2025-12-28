/**
 * Unit tests for Register component
 * Tests user registration flow with mocked API
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../context/UserContext";
import { Register } from "../pages/Register";
import * as api from "../api/api";

// Mock the API module
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

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders registration form", () => {
    renderWithProviders(<Register />);

    expect(screen.getByText(/Register \/ Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });

  it("shows validation error for empty username", async () => {
    renderWithProviders(<Register />);

    const submitButton = screen.getByRole("button", { name: /Register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for empty email", async () => {
    renderWithProviders(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    const submitButton = screen.getByRole("button", { name: /Register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    renderWithProviders(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    // Submit the form directly to bypass browser validation
    const form = emailInput.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid email address/i)
      ).toBeInTheDocument();
    });

    // Ensure API was not called with invalid email
    expect(api.createUser).not.toHaveBeenCalled();
  });

  it("successfully creates user and navigates to home", async () => {
    const mockUser = { id: 1, username: "testuser", email: "test@example.com" };
    vi.mocked(api.createUser).mockResolvedValue(mockUser);

    renderWithProviders(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /Register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.createUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message on API failure", async () => {
    vi.mocked(api.createUser).mockRejectedValue(
      new Error("User already exists")
    );

    renderWithProviders(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /Register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });
});
