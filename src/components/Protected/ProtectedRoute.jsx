import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function ProtectedRouter({ children }) {
  const { user, loading } = useAuth();

  if (loading || loadingUserData) return <LoadingLayout />;
  if (!user) return <Navigate to="/" />;
  return <> {children}</>;
}
