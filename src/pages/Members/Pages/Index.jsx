import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { limit, orderBy, where } from "firebase/firestore";
import styled from "styled-components";
import ContentModal from "../../../components/Modal/Components/Content";
import BodyModal from "../../../components/Modal/Components/Main";
import Modal from "../../../components/Modal/Modal";
import { useUser } from "../../../context/userContext";
import {
  converterDate,
  FormatDate,
  TimeAgoDateComplete,
  TimeAgoHourFormat,
  TimeAgoHourFormatSimple,
} from "../../../helpers/moment";
import {
  getDataGeadquartersService,
  getDataGroupsService,
} from "../../../services/Data/DataServices";
import {
  getMembersService,
  getMembersServiceSearsh,
  updateMemberService,
} from "../../../services/Member/MemberServices";
import FormMember from "../Components/FormMember";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import ReactSelect from "react-select";
import {
  concatString,
  upercasePrimaryLetter,
  UppercasePrimaryLetter,
} from "../../../helpers/Other";
import ExportExcel from "react-export-excel-xlsx-fix";
import moment from "moment";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

export default function Members() {
  const { userData } = useUser();
  const [modalAdd, setModalAdd] = useState(false);
  const [memberSelected, setMemberSelected] = useState(null);

  const [groups, setGroups] = useState(null);
  const [members, setMembers] = useState(null);
  const [geadquarters, setGeadquarters] = useState(null);
  const [searchkey, setSearchkey] = useState(null);
  const [memberPrint, setMemberPrint] = useState(null);

  const handlePrintMembers = () => {
    if (members && members.length > 0) {
      const newList = [];
      members.forEach((member) => {
        const newNewItem = {
          dni: member.dni,
          lastName: member.lastName,
          motherLastName: member.motherLastName,
          names: member.names,
          memberFee: member.memberFee,
          bookletFee: member.bookletFee,
          celebrationFee: member.celebrationFee,
          totalFee: member.totalFee,
          created_at: TimeAgoDateComplete(member.created_at),
          birthdate: `${member.day}-${member.month}-${member.year}`,
          phone: member.phone,
          update_at: TimeAgoDateComplete(member.updated_at),
          group: member.group.name,
          geadquarter: `${member.geadquarter.name} - ${member.geadquarter.address}`,
          entryDate: member.entryDate,
          dischargeDate: member.dischargeDate,
          observations: member.observations,
          attorney: member.attorney,
        };
        newList.push(newNewItem);
      });
      setMemberPrint(newList);
    }
  };

  const [data, setData] = useState({
    uidGroup: null,
    uidConcept: null,
    uidGeadquarter: null,
    startDate: null,
    endDate: null,
    statu: null,
  });
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({
      ...data,
      [name]: value,
    });
  };

  const getConditions = () => {
    let conditions = [];
    if (data.startDate) {
      conditions.push(where("created_at", ">=", converterDate(data.startDate)));
    }
    if (data.endDate) {
      conditions.push(where("created_at", "<=", converterDate(data.endDate)));
    }
    if (data.statu) {
      if (data.statu === "activos") {
        conditions.push(where("statu", "==", true));
      } else if (data.statu === "inactivos") {
        conditions.push(where("statu", "==", false));
      }
    }
    if (data.uidGroup) {
      conditions.push(where("group.uid", "==", data.uidGroup));
    }
    if (data.uidGeadquarter) {
      conditions.push(where("geadquarter.uid", "==", data.uidGeadquarter));
    }
    if (
      !data.uidGroup &&
      !data.uidGeadquarter &&
      !data.statu &&
      !data.startDate &&
      !data.endDate
    ) {
      conditions = [];
    }
    return conditions;
  };
  const filter = () => {
    const conditions = getConditions();
    getMembersService(setMembers, conditions);
  };
  const searsh = () => {
    let newCon = [];

    if (searchkey && !isNumeric(searchkey)) {
      newCon.push(where("lastName", "<=", searchkey.toUpperCase() + "~"));
      newCon.push(where("lastName", ">=", searchkey.toUpperCase()));
    } else if (searchkey && isNumeric(searchkey)) {
      newCon.push(where("dni", ">=", searchkey));
      newCon.push(where("dni", "<=", searchkey + "~"));
    }

    newCon.push(limit(20));

    if (!searchkey) {
      filter();
    } else {
      getMembersServiceSearsh(setMembers, newCon);
    }
  };

  useEffect(() => {
    getDataGroupsService(setGroups);
    getDataGeadquartersService(setGeadquarters);
  }, []);

  useEffect(() => {
    filter();
  }, [
    data.statu,
    data.uidGeadquarter,
    data.uidGroup,
    data.endDate,
    data.startDate,
  ]);
  const handleUpdateStatu = async (item) => {
    let newData = { ...item };
    delete newData.uid;
    newData = {
      ...newData,
      statu: !item.statu,
      updated_user: userData.uid,
      updated_statu_at: {
        user_name: userData.name,
        user_role: userData.role,
        user_uid: userData.uid,
        date: FormatDate(),
      },
    };
    await updateMemberService(newData, item.uid, userData);
    toast.success("Estado Actualizado", {
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
  };
  useEffect(() => {
    searsh();
  }, [searchkey]);

  useEffect(() => {
    handlePrintMembers();
  }, [members]);
  function isNumeric(num) {
    return !isNaN(num);
  }

  return (
    <div className="p-4">
      <div>
        <div className="flex flex-col gap-2 mb-2 ">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-800  dark:text-zinc-50">
            Administración de los Miembros
          </h1>
          <span className="flex text-sm text-zinc-500 dark:text-zinc-300 ml-1">
            Registro, actualización, de miembros
          </span>
        </div>
        <div className="bg-white p-4 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 ">
          <div className="flex gap-1 items-center flex-wrap">
            <div className="flex h-[40px]">
              <PrimaryButton
                width="190px"
                onClick={() => {
                  setMemberSelected(null);
                  setModalAdd(true);
                }}
                type="primary"
              >
                <span className="w-6">
                  <svg viewBox="0 0 24 24" fill="none" className="icon-stroke">
                    <g id="SVGRepo_iconCarrier">
                      <path d="M6 12H18"></path> <path d="M12 18V6"></path>{" "}
                    </g>
                  </svg>
                </span>
                <span className="text-sm font-semibold">Registrar nuevo</span>
              </PrimaryButton>
            </div>
            <div className="ml-auto flex items-center flex-wrap gap-2">
              <div className="text-sm text-neutral-500">filtro:</div>
              <div>
                <ReactSelect
                  placeholder="-- Grupo --"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#3170ee" : "#bcbdbe",
                    }),
                  }}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        value: e.value,
                        name: "uidGroup",
                      },
                    })
                  }
                  name="uidConcept"
                  options={
                    groups &&
                    [
                      {
                        label: "Todos los grupos",
                        value: "",
                      },
                    ].concat(
                      groups.map((i) => {
                        return {
                          label: i.name,
                          value: i.uid,
                        };
                      })
                    )
                  }
                  className="react-select-container text-sm w-[150px]"
                  classNamePrefix="react-select"
                ></ReactSelect>
              </div>
              <div className="">
                <ReactSelect
                  placeholder="-- Sede --"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#3170ee" : "#bcbdbe",
                    }),
                  }}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        value: e.value,
                        name: "uidGeadquarter",
                      },
                    })
                  }
                  name="uidConcept"
                  options={
                    geadquarters &&
                    [
                      {
                        label: "Todos los sedes",
                        value: "",
                      },
                    ].concat(
                      geadquarters.map((i) => {
                        return {
                          label: i.name,
                          value: i.uid,
                        };
                      })
                    )
                  }
                  className="react-select-container text-sm w-[140px]"
                  classNamePrefix="react-select"
                ></ReactSelect>
              </div>
              <div className="">
                <ReactSelect
                  placeholder="-- Estado --"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#3170ee" : "#bcbdbe",
                    }),
                  }}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        ...e.target,
                        value: e.value,
                        name: "statu",
                      },
                    })
                  }
                  name="statu"
                  options={
                    groups && [
                      {
                        label: "Todos lo estados",
                        value: "",
                      },
                      {
                        label: "Activos",
                        value: "activos",
                      },
                      {
                        label: "Inactivos",
                        value: "inactivos",
                      },
                    ]
                  }
                  className="react-select-container text-sm w-[140px]"
                  classNamePrefix="react-select"
                ></ReactSelect>
              </div>
            </div>
            <div className="w-[270px]">
              <div className="w-full">
                <div className="relative">
                  <input
                    data-toggle="dropdown"
                    onChange={(e) => setSearchkey(e.target.value)}
                    value={searchkey ? searchkey : ""}
                    placeholder="Buscar por DNI o Apellido Paterno"
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
            <div>
              {members && members.length > 0 ? (
                <ExcelFile
                  filename={`Reporte de Miembros - ${moment()
                    .subtract(10, "days")
                    .calendar()}`}
                  element={
                    <div className="w-[100px]">
                      <PrimaryButton type="default">
                        <span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="icon-stroke"
                          >
                            <g id="SVGRepo_iconCarrier">
                              <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"></path>{" "}
                              <path d="M3.5 12H20.33"></path>{" "}
                            </g>
                          </svg>
                        </span>{" "}
                        Excel
                      </PrimaryButton>
                    </div>
                  }
                >
                  <ExcelSheet data={memberPrint} name={`Reporte Miembros`}>
                    <ExcelColumn label="N° Identificación" value="dni" />
                    <ExcelColumn label="Apellido Paterno" value="lastName" />
                    <ExcelColumn
                      label="Apellido Materno"
                      value="motherLastName"
                    />
                    <ExcelColumn label="Nombres" value="names" />
                    <ExcelColumn label="Apoderado" value="attorney" />
                    <ExcelColumn label="Cuota de miembro" value="memberFee" />
                    <ExcelColumn label="Cuota Librito" value="bookletFee" />
                    <ExcelColumn
                      label="Cuota Celebración"
                      value="celebrationFee"
                    />
                    <ExcelColumn label="Cuota total" value="totalFee" />
                    <ExcelColumn
                      label="Fecha de nacimiento"
                      value="birthdate"
                    />
                    <ExcelColumn label="Teléfono" value="phone" />
                    <ExcelColumn label="Grupo" value="group" />
                    <ExcelColumn label="Sede" value="geadquarter" />
                    <ExcelColumn label="Fecha Ingreso" value="entryDate" />
                    <ExcelColumn label="Fecha Baja" value="dischargeDate" />
                    <ExcelColumn label="Fecha de registro" value="created_at" />
                    <ExcelColumn
                      label="Fecha de actualizacion"
                      value="update_at"
                    />
                    <ExcelColumn label="Observaciones " value="paymentType" />
                  </ExcelSheet>
                </ExcelFile>
              ) : (
                <div className="w-[100px]">
                  <PrimaryButton type="default">
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="icon-stroke"
                      >
                        <g id="SVGRepo_iconCarrier">
                          <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"></path>{" "}
                          <path d="M3.5 12H20.33"></path>{" "}
                        </g>
                      </svg>
                    </span>{" "}
                    Excel
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <div className=" w-full rounded-md max-w-full overflow-x-auto">
              <table className="w-full ">
                <thead className="text-sm  dark:border-b-zinc-700 h-[35px] font-normal">
                  <tr className="border-0  dark:text-zinc-200">
                    <th className="w-[0px]">{members && members.length}</th>
                    <th className="mb-1 p-2 px-3 font-semibold min-w-[180px]">
                      <div className=" text-left">Apellidos y Nombres</div>
                    </th>
                    <th className=" font-semibold w-[80px]">
                      <div className="text-center">Grupo</div>
                    </th>
                    <th className=" font-semibold min-w-[200px] w-[200px]">
                      <div className="text-left">Sede</div>
                    </th>
                    <th className=" font-semibold w-[90px]">
                      <div className="text-center">Estado</div>
                    </th>
                    <th className=" font-semibold w-[130px] min-w-[130px] text-right pr-2">
                      Cuota Mensual
                    </th>
                    <th className=" font-semibold w-[200px] min-w-[200px] text-left pl-5">
                      Registro
                    </th>
                    <th className=" font-semibold w-[120px] min-w-[120px] text-left ">
                      Fecha-Ingreso
                    </th>
                    <th className=" font-semibold w-[120px] min-w-[120] text-left ">
                      Fecha-Baja
                    </th>
                    <th className=" font-semibold w-[290px] min-w-[290px]  text-left pl-2">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                {}
                <tbody>
                  {members &&
                    members.map((member, index) => (
                      <Opcy
                        onDoubleClick={() => {
                          setMemberSelected(member);
                          setModalAdd(true);
                        }}
                        key={index}
                        className="cursor-default dark:text-neutral-200 dark:hover:bg-[#3a3a3a] hover:bg-[#b1b4b633]  transition-colors  text-sm "
                      >
                        <td className="px-2 w-[40px] mx-auto text-center  rounded-l-sm">
                          {member.verify && (
                            <div
                              tooltip="Verificado por Reniec"
                              className="w-5 text-neutral-500 dark:text-neutral-300"
                            >
                              <svg
                                className="icon-stroke"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.63996 20.59 3.08997 16.01 3.08997 11.12V6.72997C3.08997 5.90997 3.70998 4.97998 4.47998 4.66998L10.05 2.39001C11.3 1.88001 12.71 1.88001 13.96 2.39001L19.53 4.66998C20.29 4.97998 20.92 5.90997 20.92 6.72997L20.91 11.12Z"></path>
                                </g>
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="py-[8px] px-2 pl-1  relative">
                          <div>
                            <div
                              className="flex items-center gap-1 text-neutral-900 dark:text-neutral-200 font-semibold h-full"
                              to="/"
                            >
                              {upercasePrimaryLetter(
                                concatString([
                                  member.lastName,
                                  member.motherLastName + ",",
                                  member.names,
                                ])
                              )}
                            </div>
                          </div>
                          <div className="text-zinc-500 dark:text-zinc-400 text-xs">
                            {member.dni}
                          </div>
                        </td>
                        <td className="text-center text-xs font-semibold">
                          <div>{member.group.name}</div>
                        </td>
                        <td className="">
                          <div>
                            <div className="font-semibold">
                              {member.geadquarter.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {member.geadquarter.address}
                            </div>
                          </div>
                        </td>
                        <td className="text-center ">
                          <div className="flex items-center">
                            <div className="ml-auto">
                              <div
                                className={`w-[6px] h-[6px] ${
                                  member.statu ? " bg-green-600" : " bg-red-500"
                                }  rounded-full`}
                              ></div>
                            </div>
                            <div
                              onClick={() => handleUpdateStatu(member)}
                              tooltip={
                                member.updated_statu_at
                                  ? `Actualizado ${TimeAgoHourFormat(
                                      member.updated_statu_at.date
                                    )} por ${member.updated_statu_at.user_name}`
                                  : "Cambiar Estado"
                              }
                              className={`p-[5px] cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-md mx-auto font-semibold text-xs w-[65px] flex items-center justify-center`}
                            >
                              <div className="text">
                                {member.statu ? "Activo" : "Inactivo"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="ml-auto">
                          <div className="flex items-center font-semibold">
                            <div className="text-right ml-auto pr-2">
                              S/ {parseInt(member.totalFee).toFixed(2)}
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
                        <td className="rounded-r-sm text-left pl-5  pr-5">
                          <div>
                            <div>
                              {UppercasePrimaryLetter(
                                TimeAgoHourFormatSimple(member.created_at)
                              )}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {UppercasePrimaryLetter(
                                TimeAgoHourFormat(member.created_at)
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {UppercasePrimaryLetter(
                              TimeAgoHourFormatSimple(member.entryDate)
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            {UppercasePrimaryLetter(
                              TimeAgoHourFormatSimple(member.dischargeDate)
                            )}
                          </div>
                        </td>
                        <td>
                          <div>{member.observations}</div>
                        </td>
                      </Opcy>
                    ))}
                </tbody>
              </table>
              {members && members.length < 1 && (
                <div className="mx-auto text-center py-10 font-semibold text-zinc-400">
                  No hay nada que mostrar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={modalAdd}
        close={() => setModalAdd(!modalAdd)}
      >
        <ContentModal width="450px">
          <BodyModal>
            <FormMember
              data={memberSelected}
              close={() => setModalAdd(!modalAdd)}
            />
          </BodyModal>
        </ContentModal>
      </Modal>
    </div>
  );
}

const Opcy = styled.tr`
  .svg {
    display: none;
  }
  &:hover {
    .span {
      display: none;
    }
    .svg {
      display: block;
    }
  }
`;
