import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EclipseButton from "../../components/Button/EclipseButton";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { useAuth } from "../../context/authContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { recoveryPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState(null);
  const close = () => {
    navigate("/");
  };
  const onSubmit = async () => {
    setLoading(true);
    try {
      const result = await recoveryPassword(email);
      console.log(result);
      setLoading(false);
      close();
      toast.success("Revisa tu correo electronico", {
        style: {
          padding: "7px",
          paddingLeft: "10px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      setError(error.code);
      setLoading(false);
    }
  };
  return (
    <div className=" flex">
      <div className="bg-white flex flex-col gap-2 mx-auto mt-10 max-w-[400px] p-5 rounded-md border">
        <div className="flex items-center gap-2">
          <div>
            <EclipseButton
              onClick={close}
              type="default"
              size="medium"
              icon={
                <svg
                  className="icon-stroke dark:text-zinc-300"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008"></path>{" "}
                  </g>
                </svg>
              }
            />
          </div>
          <h1 className="font-semibold">Restablecer tu contraseña</h1>
        </div>
        <span className="text-sm text-neutral-400 flex leading-4">
          Te enviaremos un link a tu correo electronico, en la cual podra
          restablecer tu contraseña.
        </span>
        <div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="border text-sm border-neutral-400 focus:border-blue-600  w-full mt-2 rounded-[5px] p-2"
            type="text"
          />
          {error && (
            <div className="text-red-500 text-xs pt-1 ">Este email no existe en nuestra base de datos</div>
          )}
        </div>
        <div>
          <PrimaryButton
            loading={loading}
            disabled={!email ? true : false}
            type="primary_transparent"
            onClick={onSubmit}
          >
            Enviar
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
