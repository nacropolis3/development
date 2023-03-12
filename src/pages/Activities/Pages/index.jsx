import { limit, orderBy, startAfter } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Navigate } from "react-router-dom";
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
    getActivitiesService(setActivities, [], [], setLast);
  }, []);

  if (userData.role === "EconomyArea") {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-4">
      <div>
        <div className="bg-white dark:bg-neutral-800 dark:border-neutral-700 p-4 border rounded-md ">
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
