import React from "react";
import { useAuth } from "../../context/authContext";
import { useUser } from "../../context/userContext";
import NoPermiseUser from "../../pages/404/NoPermiseUser";
import { LoadingLayout } from "../Loader/LoadingLayout";

export default function ProtectedUser({ children }) {
  const { userData, loadingUserData } = useUser();
  const { loading } = useAuth();
  if (loadingUserData || loading) return <LoadingLayout />;
  if (!userData.role || !userData.statu) return <NoPermiseUser />;
  return <> {children}</>;
}
