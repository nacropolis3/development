import React, { useEffect } from "react";
import { useObject } from "../../hooks/useObject";
import {
  getUsersService,
  updateUserService,
} from "../../services/user/userServices";
import { TimeAgoHourFormat } from "../../helpers/moment";
import { useUser } from "../../context/userContext";

export default function User() {
  const [users, setUsers] = useObject();
  const { userData } = useUser();

  const handleUpdateRol = async (user, e) => {
    let newRol = null;
    if (e.target.value.trim() === "") {
      newRol = null;
    } else {
      newRol = e.target.value;
    }
    const newUser = {
      ...user,
      role: newRol,
    };
    await updateUserService(newUser, user.uid);
  };

  const handleUpdateStatu = async (user) => {
    const newUser = {
      ...user,
      statu: !user.statu,
    };
    await updateUserService(newUser, user.uid);
  };

  useEffect(() => {
    getUsersService(setUsers);
  }, []);
  return (
    <div className=" flex flex-col gap-2 mx-auto p-5">
      <div className="p-4 bg-white dark:bg-neutral-800 dark:border-neutral-700 border rounded-md">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold dark:text-neutral-200 tracking-tight leading-7">
            Gestion de usuarios
          </h1>
          <span className="text-zinc-500 dark:text-neutral-400 text-sm flex leading-4">
            Administra los usuarios que tienen acceso al sistema
          </span>
        </div>
        <div className="overflow-x-auto max-w-full w-full">
          <table className="w-full ">
            <thead className="text-sm h-[35px] font-normal">
              <tr className="border-0 dark:text-neutral-200">
                <th className="w-[40px]"></th>
                <th className="font-semibold min-w-[180px]">
                  <div className=" text-left">Nombre</div>
                </th>
                <th className=" font-semibold w-[280px]">
                  <div className="text-left">Correo</div>
                </th>
                <th className=" font-semibold min-w-[120px] w-[120px]">
                  <div className="text-left">Estado</div>
                </th>
                <th className=" font-semibold min-w-[120px]">
                  <div className="text-left">Entrada</div>
                </th>
                <th className=" font-semibold w-[100px]">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => (
                  <tr key={index} className="text-sm border-t dark:text-neutral-200 dark:border-neutral-600">
                    <td className="p-3 py-3">{index + 1}</td>
                    <td className="">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-[30px] h-[30px] rounded-full border overflow-hidden">
                            <img
                              className="object-cover w-full h-full"
                              src={user.photoUrl}
                              referrerPolicy="no-referrer"
                              alt=""
                            />
                          </div>
                          <div className="absolute bottom-0 right-1">
                            {user.providerId.split(".")[0] === "facebook" ? (
                              <div className="w-4">
                                <svg viewBox="0 0 32 32" fill="none">
                                  <g id="SVGRepo_iconCarrier">
                                    <circle
                                      cx="16"
                                      cy="16"
                                      r="14"
                                      fill="url(#paint0_linear_87_7208)"
                                    ></circle>
                                    <path
                                      d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
                                      fill="white"
                                    ></path>
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_87_7208"
                                        x1="16"
                                        y1="2"
                                        x2="16"
                                        y2="29.917"
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop
                                          style={{
                                            stopColor: "#0163E0",
                                          }}
                                        ></stop>
                                        <stop
                                          offset="1"
                                          style={{
                                            stopColor: "#0163E0",
                                          }}
                                        ></stop>
                                      </linearGradient>
                                    </defs>
                                  </g>
                                </svg>
                              </div>
                            ) : user.providerId.split(".")[0] === "google" ? (
                              <div className="w-4 bg-white rounded-full">
                                <svg viewBox="0 0 16 16" fill="none">
                                  <path
                                    fill="#4285F4"
                                    d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z"
                                  />
                                  <path
                                    fill="#34A853"
                                    d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z"
                                  />
                                  <path
                                    fill="#FBBC04"
                                    d="M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z"
                                  />
                                  <path
                                    fill="#EA4335"
                                    d="M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z"
                                  />
                                </svg>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="font-semibold">
                          {user.name}{" "}
                          <span className="text-blue-500">
                            {user.uid === userData.uid && "(Yo)"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-blue-500">{user.email}</div>
                    </td>
                    <td>
                      <div className="ml-auto">
                        <div className="flex items-center">
                          <div className="ml-auto">
                            <div
                              className={`w-[6px] h-[6px] ${
                                user.statu ? " bg-green-600" : " bg-red-500"
                              }  rounded-full`}
                            ></div>
                          </div>
                          <div
                            onClick={() => {
                              user.role != "Owner" && handleUpdateStatu(user);
                            }}
                            title="Cambiar estado"
                            className={`p-[5px] cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md mx-auto font-semibold text-xs w-[65px] flex items-center justify-center`}
                          >
                            <div className="text">
                              {user.statu ? "Activo" : "Inactivo"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{TimeAgoHourFormat(user.created_at)}</td>
                    <td>
                      <div>
                        {user.role === "Owner" ? (
                          <div
                            tooltip="Imposible cambiar el rol"
                            className="font-semibold text-center"
                          >
                            Dueño
                          </div>
                        ) : (
                          <select
                            className="outline-none rounded-[4px] p-[5px] border cursor-pointer border-neutral-300 hover:border-zinc-500 transition-colors"
                            defaultValue={user.role}
                            onChange={(e) => {
                              handleUpdateRol(user, e);
                            }}
                          >
                            <option value="">Sin rol</option>
                            <option value="Admin">Administrador</option>
                            <option value="EconomyArea">
                              Area de Economia
                            </option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
             
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
