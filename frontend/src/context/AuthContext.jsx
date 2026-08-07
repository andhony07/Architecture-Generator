import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        // safe fallback
      }
    }
    return initialToken ? { authenticated: true } : null;
  });
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const login = (jwtToken, userData = null) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser({ authenticated: true });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (token && (!user || !user.email)) {
      api.get("/auth/profile")
        .then((res) => {
          if (isMounted && res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem("user", JSON.stringify(res.data.data));
          }
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
          if (isMounted) {
            logout();
          }
        });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);