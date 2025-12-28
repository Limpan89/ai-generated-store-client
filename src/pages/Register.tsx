/**
 * Register page - user registration form
 * Creates a new user via API and stores user ID in context/localStorage
 */

import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { createUser } from "../api/api";
import styles from "./Register.module.css";

export function Register() {
  const navigate = useNavigate();
  const { currentUserId, setCurrentUserId } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, show current user info
  if (currentUserId) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Already Logged In</h2>
          <p className={styles.info}>
            You are currently logged in as User ID: {currentUserId}
          </p>
          <div className={styles.actions}>
            <button onClick={() => navigate("/")} className={styles.homeBtn}>
              Go to Products
            </button>
            <button
              onClick={() => navigate("/cart")}
              className={styles.cartBtn}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const user = await createUser({
        username: username.trim(),
        email: email.trim(),
      });

      // Store user ID in context (which persists to localStorage)
      setCurrentUserId(user.id);

      // Navigate to home page after successful registration
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register / Login</h2>
        <p className={styles.subtitle}>
          Create a new account or login with your existing credentials
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className={styles.input}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={styles.input}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
