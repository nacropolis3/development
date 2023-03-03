import React from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { useAuth } from "../../context/authContext";
import { useUser } from "../../context/userContext";
import traduction from "../../data/traduction.json";

export default function Home() {
  const { logout } = useAuth();
  const { userData, setUserData } = useUser();

  return (
    <div className="py-10 min-h-[80vh] flex items-center justify-center w-full">
      <div>
        <div className="flex justify-center ">
          <img src="/assets/welcome.png" alt="" />
        </div>
        <div className="text-center">
          <h1 className="text-7xl dark:text-zinc-200 font-extrabold tracking-tighter max-w-[700px]">
            Bievenido {userData.name}
          </h1>
        </div>
        <div className="text-center pt-3">
          <span className="text-zinc-500">{traduction[userData.role].spanish}</span>
        </div>
        <div className="pt-2">
          <PrimaryButton onClick={logout} type="default">
            <span>
              <img
                className="w-[30px] h-[30px] rounded-full overflow-hidden border"
                src={userData.photoUrl}
                alt=""
              />
            </span>
            <span>
              Salir de <span className="text-blue-500">{userData.name}</span>
            </span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
