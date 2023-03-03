import { limit, orderBy, startAfter } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUser } from "../../../context/userContext";
import {
  TimeAgoHourFormat,
  TimeAgoHourFormatSimple,
} from "../../../helpers/moment";
import {
  upercasePrimaryLetter,
  UppercasePrimaryLetter,
} from "../../../helpers/Other";
import { getActivitiesService } from "../../../services/Activities/ActivitiesServices";

export default function Activities() {
  const [activities, setActivities] = useState(null);
  const [lastVisible, setLastVisible] = useState({});
  const { userData } = useUser();

  function setLast(data) {
    setLastVisible(data);
  }

  const fetchData = async () => {
    // const conditions = getConditions();
    const conditions = [];
    getActivitiesService(
      setActivities,
      activities,
      [...conditions, startAfter(lastVisible), limit(20)],
      setLast
    );
  };

  useEffect(() => {
    getActivitiesService(
      setActivities,
      [],
      [],
      setLast
    );
  }, []);
  return (
    <div className="p-4">
      <div>
        <div className="bg-white p-4 border rounded-md ">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-bold tracking-tighter text-gray-800 dark:text-zinc-50">
              Historial de actividades
            </h1>
            <span className="flex text-sm text-zinc-500 dark:text-zinc-300 ">
              Historial de cada usuario en el sistema
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-[270px]">
              <div className="w-full">
                <div className="relative">
                  <input
                    data-toggle="dropdown"
                    // onChange={(e) => setSearchkey(e.target.value)}
                    placeholder="Buscar por nombre"
                    type="text"
                    // value={searchkey ? searchkey : ""}
                    className="px-4 pl-7 text-sm w-full  h-[35px] flex items-center justify-center py-1 outline-none dark:bg-[#7e7e7e36] bg-[#a8a8a836] dark:hover:bg-[#7e7e7e5b] hover:bg-[#a8a8a81a] transition-colors dark:text-[#ffffff] rounded-md"
                  />
                  <div className="pointer-events-none w-4 absolute top-[50%] translate-y-[-50%] left-2">
                    <svg
                      className="text-[#464545] dark:text-[#949494]"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g
                        style={{
                          clipPath: "url(#clip0_35_20)",
                        }}
                      >
                        <path
                          d="M10.8874 0C5.86273 0 1.7748 4.08789 1.7748 9.11258C1.7748 11.2861 2.54012 13.284 3.81496 14.852L0 18.6669L1.33312 20L5.14809 16.185C6.71594 17.4598 8.71387 18.2252 10.8874 18.2252C15.9121 18.2252 20 14.1373 20 9.11258C20 4.08789 15.9121 0 10.8874 0ZM10.8874 16.3398C6.90234 16.3398 3.6602 13.0977 3.6602 9.11258C3.6602 5.1275 6.9023 1.88535 10.8874 1.88535C14.8725 1.88535 18.1146 5.1275 18.1146 9.11258C18.1146 13.0977 14.8725 16.3398 10.8874 16.3398Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_35_20">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <InfiniteScroll
              next={fetchData}
              dataLength={activities && activities.length}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              hasMore={true}
              loader={<h4></h4>}
              scrollableTarget="scrollableDiv"
            ></InfiniteScroll>
            <div className=" ">
              <table className="w-full ">
                <thead className="text-sm  border-b dark:border-b-zinc-700 h-[35px] font-normal">
                  <tr className="border-0  dark:text-zinc-200">
                    {/* <th className="w-[0px]">
                      {activities && activities.length}
                    </th> */}
                    <th className=" font-semibold pl-2 w-[150px]">
                      <div className="text-left">Modulo</div>
                    </th>
                    <th className=" font-semibold w-[280px] text-left pr-2">
                      Accion
                    </th>
                    <th className="mb-1 p-2 px-3 font-semibold ">
                      <div className=" text-left">Descripción</div>
                    </th>
                    <th className=" font-semibold">
                      <div className="text-left">Usuario</div>
                    </th>
                    <th className=" font-semibold min-w-[200px] w-[200px]">
                      <div className="text-left">Fecha</div>
                    </th>
                  </tr>
                </thead>
                {}
                <tbody>
                  {activities &&
                    activities.map((item, index) => (
                      <tr
                        // onDoubleClick={() => {
                        //   setMemberSelected(item);
                        //   setModalAdd(true);
                        // }}
                        key={index}
                        className="cursor-default dark:text-zinc-200 dark:hover:bg-[#18191a] hover:bg-[#b1b4b633]  transition-colors  text-sm "
                      >
                        <td className="text-left py-4 pl-2 text-sm font-semibold">
                          <div>{upercasePrimaryLetter(item.module)}</div>
                        </td>
                        <td className="text-left ">
                          <div className="font-semibold">
                            {item.action.name}
                          </div>
                          <div className="text-xs text-neutral-500">
                            uid: {item.action.uid}
                          </div>
                        </td>
                        <td className="text-left ">
                          <div className="font-normal text-sm">
                            {item.description}
                          </div>
                        </td>
                        <td className="py-[8px]">
                          <div className="flex items-center gap-2">
                            <div className="w-[25px] min-w-[25px] h-[25px] overflow-hidden border rounded-full">
                              <img
                                className="object-cover w-full h-full"
                                src={item.user.photo}
                                referrerPolicy="no-referrer"
                                alt=""
                              />
                            </div>
                            <div className="font-semibold text-xs">
                              {item.user.names}
                              {item.user.uid === userData.uid && " (Yo)"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {UppercasePrimaryLetter(
                              TimeAgoHourFormatSimple(item.created_at)
                            )}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {UppercasePrimaryLetter(
                              TimeAgoHourFormat(item.created_at)
                            )}
                          </div>
                        </td>

                        {/* <td className="">
                          <div>
                            <div className="font-semibold">
                              {item.geadquarter.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {item.geadquarter.address}
                            </div>
                          </div>
                        </td>
                        <td className="text-center ">
                          <div className="flex items-center">
                            <div className="ml-auto">
                              <div
                                className={`w-[6px] h-[6px] ${
                                  item.statu ? " bg-green-600" : " bg-red-500"
                                }  rounded-full`}
                              ></div>
                            </div>
                            <div
                              onClick={() => handleUpdateStatu(item)}
                              tooltip={
                                item.updated_statu_at
                                  ? `Actualizado ${TimeAgoHourFormat(
                                      item.updated_statu_at.date
                                    )} por ${item.updated_statu_at.user_name}`
                                  : "Cambiar Estado"
                              }
                              className={`p-[5px] cursor-pointer hover:bg-neutral-200 rounded-md mx-auto font-semibold text-xs w-[65px] flex items-center justify-center`}
                            >
                              <div className="text">
                                {item.statu ? "Activo" : "Inactivo"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="ml-auto">
                          <div className="flex items-center font-semibold">
                            <div className="text-right ml-auto pr-2">
                              S/ {parseInt(item.totalFee).toFixed(2)}
                            </div>
                            <div className="w-4 h-4">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="icon-stroke"
                              >
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M11.74 17.7499H17.66C17.57 17.8299 17.48 17.8999 17.39 17.9799L13.12 21.1799C11.71 22.2299 9.41001 22.2299 7.99001 21.1799L3.71001 17.9799C2.77001 17.2799 2 15.7299 2 14.5599V7.14986C2 5.92986 2.93001 4.57986 4.07001 4.14986L9.05 2.27986C9.87 1.96986 11.23 1.96986 12.05 2.27986L17.02 4.14986C17.97 4.50986 18.78 5.50986 19.03 6.52986H11.73C11.51 6.52986 11.31 6.53987 11.12 6.53987C9.27 6.64987 8.78999 7.31986 8.78999 9.42986V14.8598C8.79999 17.1598 9.39001 17.7499 11.74 17.7499Z"></path>{" "}
                                  <path d="M8.80005 11.22H22"></path>
                                  <path d="M22 9.41977V14.9698C21.98 17.1898 21.37 17.7397 19.06 17.7397H11.7401C9.39005 17.7397 8.80005 17.1498 8.80005 14.8398V9.40976C8.80005 7.30976 9.28005 6.63974 11.1301 6.51974C11.3201 6.51974 11.5201 6.50977 11.7401 6.50977H19.06C21.41 6.51977 22 7.09977 22 9.41977Z"></path>{" "}
                                  <path d="M11.3201 15.2598H12.6501"></path>
                                  <path d="M14.75 15.2598H18.02"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="rounded-r-sm text-left pl-5">
                          <div>
                            <div>
                              {UppercasePrimaryLetter(
                                TimeAgoHourFormatSimple(item.created_at)
                              )}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {UppercasePrimaryLetter(
                                TimeAgoHourFormat(item.created_at)
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{item.observations}</div>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
              {activities && activities.length < 1 && (
                <div className="mx-auto text-center py-10 font-semibold text-zinc-400">
                  No hay nada que mostrar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
