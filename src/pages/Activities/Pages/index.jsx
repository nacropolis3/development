import { limit, orderBy, startAfter, where } from "firebase/firestore";
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
import { getUsersService } from "../../../services/user/userServices";

export default function Activities() {
  const [activities, setActivities] = useState(null);
  const [lastVisible, setLastVisible] = useState({});
  const [users, setUsers] = useState(null);
  const { userData } = useUser();
  const [data, setData] = useState({
    module: null,
    user: null,
  });

  const handeChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  function setLast(data) {
    setLastVisible(data);
  }

  const getConditions = () => {
    const conditions = [];
    if (data.user) {
      conditions.push(where("user.uid", "==", data.user));
    }
    if (data.module) {
      conditions.push(where("module", "==", data.module));
    }
    return conditions;
  };

  const fetchData = async () => {
    const conditions = getConditions();
    getActivitiesService(
      setActivities,
      activities,
      [...conditions, startAfter(lastVisible), limit(20)],
      setLast
    );
  };

  useEffect(() => {
    getActivitiesService(setActivities, [], [], setLast);
    getUsersService(setUsers);
  }, []);

  useEffect(() => {
    const conditions = getConditions();
    getActivitiesService(
      setActivities,
      [],
      [...conditions, orderBy("created_at", "desc")],
      setLast
    );
  }, [data.module, data.user]);

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
          <div className="flex gap-2 flex-wrap items-center">
            <div>
              <span className="text-sm text-neutral-500">Filtro</span>
            </div>
            <div>
              <select className={`top-0 border h-[35px] px-2 text-sm rounded-[4px] border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 cursor-pointer `} onChange={handeChange} name="module">
                <option hidden>--Modulo--</option>
                <option value="">Todos los modulos</option>
                <option value="Pago">Pago</option>
                <option value="Miembros">Miembros</option>
                <option value="TIcket">Ticket</option>
              </select>
            </div>
            <div>
              <select className={`top-0 border h-[35px] px-2 text-sm rounded-[4px] border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 cursor-pointer `} onChange={handeChange} name="user" id="">
                <option hidden>--Usuario--</option>
                <option value="">Todos los usuarios</option>
                {users &&
                  users.map((user, index) => (
                    <option key={index} value={user.uid}>
                      {user.name}
                    </option>
                  ))}
              </select>
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
