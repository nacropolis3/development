import { useState } from "react";
import { useEffect } from "react";
import { useContext, createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getCompanyService } from "../services/Company/CompanyServices";
import { useUser } from "./userContext";

const companyContext = createContext();

export const useCompany = () => {
  const context = useContext(companyContext);
  if (!context === undefined) throw new Error("There is not company provider");
  return context;
};

export function CompanyProvider({ children }) {
  const { userData, loadingUserData } = useUser();

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companies, setCompanies] = useState(null);
  const [companySelected, setCompanySelected] = useLocalStorage(
    "companySelected",
    ""
  );
  const getCompanies = async () => {
    if (userData && userData.companies.length > 0) {
      const newCompanies = [];
      await Promise.all(
        userData.companies.map(async (company) => {
          const data = await getCompanyService(company);
          newCompanies.push(data);
        })
      );
      if (!companySelected) {
        setCompanySelected(newCompanies[0]);
      }
      setLoadingCompanies(false);
      setCompanies(newCompanies);
    } else {
      setLoadingCompanies(false);
      setCompanies([]);
    }
  };

  useEffect(() => {
    setLoadingCompanies(true);
    if (!loadingUserData) {
      getCompanies(); 
    }
  }, [userData]);
  return (
    <>
      <companyContext.Provider
        value={{
          companies,
          loadingCompanies,
        }}
      >
        {children}
      </companyContext.Provider>
    </>
  );
}
