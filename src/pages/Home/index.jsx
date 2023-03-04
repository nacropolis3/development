import React from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { useAuth } from "../../context/authContext";
import { useUser } from "../../context/userContext";
import traduction from "../../data/traduction.json";

export default function Home() {
  const { logout } = useAuth();
  const { userData, setUserData } = useUser();

  return (
    <div className="py-10 min-h-[88vh] flex items-center justify-center w-full">
      <div className=" p-2">
        <div className="flex justify-center ">
          <img width="250" height="250" src="/assets/welcome.png" alt="" />
        </div>
        <div>
          <div className="text-center">
            <h1 className="text-sm mt-1 text-neutral-500 font-semibold max-w-[700px]">
              Bievenido al sistema
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
