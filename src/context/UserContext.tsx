/**
 * User context provider for managing global user state
 * Stores current user ID in localStorage for persistence
 * Provides currentUserId and setCurrentUserId to all child components
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  currentUserId: number | null;
  setCurrentUserId: (id: number | null) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_ID_STORAGE_KEY = "ai-store-user-id";

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserIdState] = useState<number | null>(null);

  // Load user ID from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (stored) {
      const id = parseInt(stored, 10);
      if (!isNaN(id)) {
        setCurrentUserIdState(id);
      }
    }
  }, []);

  // Persist user ID to localStorage whenever it changes
  const setCurrentUserId = (id: number | null) => {
    setCurrentUserIdState(id);
    if (id !== null) {
      localStorage.setItem(USER_ID_STORAGE_KEY, id.toString());
    } else {
      localStorage.removeItem(USER_ID_STORAGE_KEY);
    }
  };

  const clearUser = () => {
    setCurrentUserId(null);
  };

  return (
    <UserContext.Provider
      value={{ currentUserId, setCurrentUserId, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * Custom hook to access user context
 * Throws error if used outside UserContextProvider
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}
