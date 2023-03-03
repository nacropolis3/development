import React from "react";
import { useAuth } from "../../context/authContext";
import SignIn from "../../pages/Login/SignIn";
import { LoadingLayout } from "../Loader/LoadingLayout";

export default function ProtectedLogin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingLayout/>;
  if (!user) return <SignIn/>;
  return <> {children}</>;
}
