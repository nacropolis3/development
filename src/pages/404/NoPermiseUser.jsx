import React from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { useAuth } from "../../context/authContext";
import { useUser } from "../../context/userContext";

export default function NoPermiseUser() {
  const { user, logout } = useAuth();
  const { userData } = useUser();
  return (
    <div className="p-10 max-w-[700px] mx-auto min-h-[100vh] flex items-center justify-center">
      <div className="flex flex-col gap-1 bg-white rounded-md p-3">
        {/* <div className="flex justify-center">
          <img src="/assets/nofounduser.webp" className="w-96" alt="" />
        </div> */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Usuario no autorizado
          </h1>
        </div>
        <div className="mt-0">
          <p className="text-zinc-600 text-sm">
            Hola <b>{userData.name}</b>, su cuenta esta deshabilitada o no
            tienes un rol en especifico. Comunicate con el soporte para que te
            asignen uno o habiliten tu acceso al sistema.
          </p>
        </div>
        <div>
          <PrimaryButton onClick={logout} type="primary_transparent">
            Cerrar Sesión
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
