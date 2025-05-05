"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  // Render the wrapped component only if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoutes;
