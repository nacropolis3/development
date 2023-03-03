import { useState } from "react";
import { useContext, createContext } from "react";

const companyContext = createContext();

export const useLoaderMain = () => {
  const context = useContext(companyContext);
  if (!context === undefined) throw new Error("There is not company provider");
  return context;
};

export function LoaderProvider({ children }) {
  const [loaderMain, setLoader] = useState(false);
  const setLoaderMain = (value) => {
    setLoader(value);
  };
  return (
    <companyContext.Provider
      value={{
        loaderMain,
        setLoaderMain,
      }}
    >
      {children}
    </companyContext.Provider>
  );
}
