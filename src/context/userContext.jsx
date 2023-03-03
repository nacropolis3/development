import { useState } from "react";
import { useEffect } from "react";
import { useContext, createContext } from "react";
import { FormatDate } from "../helpers/moment";
import {
  getUserService,
  saveUser,
  searshEmail,
} from "../services/user/userServices";
import { useAuth } from "./authContext";

const userContext = createContext();

export const useUser = () => {
  const context = useContext(userContext);
  if (!context === undefined) throw new Error("There is not company provider");
  return context;
};

export function UserProvider({ children }) {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  const getUser = async () => {
    const userInternal = await searshEmail(user.email);
    if (!userInternal) {
      const newUser = {
        email: user.email,
        name: user.displayName,
        role: null,
        statu: true,
        photoUrl: user.photoURL,
        providerId: user.providerData[0].providerId,
        created_at: FormatDate(),
      };
      await saveUser(newUser, user.uid);
      getUserService(setUserData, user.uid);
      setLoadingUserData(false);
    } else {
      getUserService(setUserData, user.uid);
      setLoadingUserData(false);
    }
  };
  useEffect(() => {
    setLoadingUserData(true);
    if (!loading && user) {
      getUserService(setUserData, user.uid);
      getUser();
    } else if (!loading && !user) {
      setLoadingUserData(false);
    }
  }, [user]);

  return (
    <userContext.Provider
      value={{
        userData,
        loadingUserData,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
