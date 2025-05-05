"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: { name: string; email: string; id: string; role: string };
  setAuthenticated: (status: boolean) => void;
  setUser: (user: {
    name: string;
    email: string;
    id: string;
    role: string;
  }) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: { name: "", email: "", id: "", role: "" },
  setAuthenticated: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get("authToken");

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    id: string;
    role: string;
  }>({
    name: "",
    email: "",
    id: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local_user = localStorage.getItem("schedulerUserInfo");
    if (token && local_user) {
      setUser(JSON.parse(local_user));
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setLoading(false);
  }, [token]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        {/* Optional: a loading spinner or message */}
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
