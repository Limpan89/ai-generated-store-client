/**
 * Header component with navigation and user status
 * Shows login/register link or current user info and cart link
 */

import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import styles from "./Header.module.css";

export function Header() {
  const { currentUserId, clearUser } = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>AI Store</h1>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Products
          </Link>

          {currentUserId ? (
            <>
              <Link to="/cart" className={styles.navLink}>
                Cart
              </Link>
              <span className={styles.userInfo}>User ID: {currentUserId}</span>
              <button onClick={clearUser} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/register" className={styles.navLink}>
              Register / Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
