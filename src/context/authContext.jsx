import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/config";
const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context === undefined) throw new Error("There is not auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signIn(user) {
    return signInWithEmailAndPassword(auth, user.email, user.password);
  }
  async function recoveryPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  async function signUp(user) {
    return await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
  }
  const logout = async () => {
    // await setCompanySelected(null);
    await signOut(auth);
  };

  async function signInGoogle() {
    const googleProvider = new GoogleAuthProvider();
    const { user } = await signInWithRedirect(auth, googleProvider);
    setUser(user);
    return;
  }

  async function signInFacebook() {
    const facebookProvider = new FacebookAuthProvider();
    const result = await signInWithRedirect(auth, facebookProvider);
    setUser(result.user);
    return result;
  }
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <authContext.Provider
        value={{
          signUp,
          signIn,
          user,
          logout,
          loading,
          signInGoogle,
          signInFacebook,
          recoveryPassword,
        }}
      >
        {children}
      </authContext.Provider>
    </>
  );
}
