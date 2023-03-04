import React from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { useAuth } from "../../context/authContext";
import { useUser } from "../../context/userContext";
import traduction from "../../data/traduction.json";

export default function Home() {
  const { logout } = useAuth();
  const { userData, setUserData } = useUser();

  return (
    <div className=" flex items-center justify-center w-full">
      {/* <div className=" p-2">
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
      </div> */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url("assets/background.jfif")`,
          backgroundPosition: "center",
           backgroundRepeat: "no-repeat",
           backgroundSize: "cover",
          //  backdropFilter: "blur(10px)"
        }}
      >
        <div
          style={{
            // minHeight: "100vh",
            height: "100vh",

            //  backgroundColor: "red",
             marginTop: "-53px",
            //  paddingTop: "50px",
          }}
          className="w-full h-full flex items-center p-5 py-20 justify-center bg-[#ffffff94] backdrop-blur-3xl"
        >
          <img className="max-h-full" src="assets/background.jfif" alt="" />
        </div>
      </div>
    </div>
  );
}
