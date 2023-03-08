import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContentModal from "../../components/Modal/Components/Content";
import InfiniteScroll from "react-infinite-scroll-component";
import BodyModal from "../../components/Modal/Components/Main";
import Modal from "../../components/Modal/Modal";
import {
  getPaymentsService,
  getPaymentsServiceSearsh,
} from "../../services/Payment/PaymentServices";
import FromPayment from "./Components/Form";
import {
  converterDate,
  TimeAgoDate,
  TimeAgoHourFormat,
  TimeAgoHourFormatSimple,
} from "../../helpers/moment";
import {
  concatString,
  upercasePrimaryLetter,
  UppercasePrimaryLetter,
} from "../../helpers/Other";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { useUser } from "../../context/userContext";
import {
  getDataConcepetsService,
  getDataGroupsService,
} from "../../services/Data/DataServices";
import { limit, orderBy, startAfter, where } from "firebase/firestore";
import moment from "moment";
import ExportExcel from "react-export-excel-xlsx-fix";
import TicketPaymount from "./Components/Ticket";
import ReactSelect from "react-select";
import Rotation from "../../components/Loader/Rotation";
import ViewPayment from "./Components/View";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

export default function Payments() {
  const { userData } = useUser();
  const [modalAdd, setModalAdd] = useState(false);
  const [modalView, setModalView] = useState(false);

  const [concepts, setConcepts] = useState(null);
  const [groups, setGroups] = useState(null);
  const [searchkey, setSearchkey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    uidGroup: null,
    uidConcept: null,
    startDate: null,
    endDate: null,
  });
  const [payments, setPayments] = useState(null);

  const [payment, setPayment] = useState(null);

  const [paymentsPrint, setPaymentsPrint] = useState(null);

  const [lastVisible, setLastVisible] = useState({});

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handlePrintPayments = () => {
    if (payments && payments.length > 0) {
      const newList = [];
      payments.forEach((payment) => {
        const newPayHeader = {
          code: payment.billHeader,
          member: payment.member.names,
          fee: payment.member.totalFee,
          payment_at: upercasePrimaryLetter(TimeAgoDate(payment.payment_at)),
          payment_hour_at: upercasePrimaryLetter(
            moment(payment.payment_at).format("LT")
          ),
          paymentType:
            payment.paymentType === "cash"
              ? "Efectivo"
              : payment.paymentType === "mobilePayments"
              ? "Pago Mobil"
              : "Transferencia Bancaria",
          codePaymentType: payment.codePaymentType,
          concept: payment.concept.name,
          observations: payment.observations,
        };
        payment.paymountList.forEach((item) => {
          const newListMonth = {
            ...newPayHeader,
            date: item.date,
            imported: item.imported,
            debt: item.debt,
          };
          newList.push(newListMonth);
        });
      });
      setPaymentsPrint(newList);
    }
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  function dateOnName(date) {
    const dateObj = new Date(date);
    let month = months[dateObj.getMonth() + 1];
    if (dateObj.getMonth() === 11) {
      month = "Enero";
    }
    return month;
  }
  function isNumeric(num) {
    return !isNaN(num);
  }

  function setLast(data) {
    setLastVisible(data);
  }

  const getConditions = () => {
    let conditions = [];
    if (data.startDate) {
      conditions.push(where("payment_at", ">=", converterDate(data.startDate)));
    }
    if (data.endDate) {
      conditions.push(where("payment_at", "<=", converterDate(data.endDate)));
    }
    if (data.uidConcept) {
      conditions.push(where("concept.uid", "==", data.uidConcept));
    }
    if (data.uidGroup) {
      conditions.push(where("member.group.uid", "==", data.uidGroup));
    }
    if (!data.uidConcept && !data.uidGroup && !data.startDate && data.endDate) {
      conditions = [];
    }
    conditions.push(limit(20));
    return conditions;
  };

  const filter = () => {
    const conditions = getConditions();
    getPaymentsService(
      setPayments,
      [],
      [...conditions, orderBy("payment_at", "desc")],
      setLast
    );
  };

  const searsh = () => {
    let newCon = [];
    if (searchkey && !isNumeric(searchkey)) {
      newCon.push(where("member.names", ">=", searchkey.toUpperCase()));
      newCon.push(where("member.names", "<=", searchkey.toUpperCase() + "~"));
    } else if (searchkey && isNumeric(searchkey)) {
      newCon.push(where("member.dni", ">=", searchkey));
      newCon.push(where("member.dni", "<=", searchkey + "~"));
    }
    newCon.push(limit(20));
    if (!searchkey) {
      filter();
    } else {
      getPaymentsServiceSearsh(setPayments, newCon);
    }
  };

  const fetchData = async () => {
    const conditions = getConditions();
    getPaymentsService(
      setPayments,
      payments,
      [...conditions, orderBy("payment_at", "desc"), startAfter(lastVisible)],
      setLast
    );
  };

  useEffect(() => {
    searsh();
  }, [searchkey]);

  useEffect(() => {
    filter();
  }, [data.uidConcept, data.uidGroup, data.endDate, data.startDate]);

  useEffect(() => {
    handlePrintPayments();
  }, [payments]);

  useEffect(() => {
    getDataConcepetsService(setConcepts, []);
    getDataGroupsService(setGroups, []);
    getPaymentsService(
      setPayments,
      [],
      [orderBy("payment_at", "desc"), limit(20)],
      setLast
    );
    setLoading(false);
  }, []);
  return (
    <Container className="p-5 ">
      <div className="flex flex-col mb-3 gap-2">
        <h1 className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-zinc-50">
          Gestión de pagos
        </h1>
        <span className="flex text-sm text-zinc-500 dark:text-zinc-300 ml-1">
          Administra los pagos de cada socio registrado y activos
        </span>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 border dark:border-neutral-700 rounded-md">
        <div className=" flex  gap-1 flex-wrap ">
          <div className="flex mr-auto">
            <PrimaryButton
              width="190px"
              onClick={() => {
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
              <span className="text-sm font-semibold">
                Registrar nuevo pago
              </span>
            </PrimaryButton>
          </div>
          <div className=" flex items-center flex-wrap gap-2 ">
            <div className="text-sm text-neutral-500">Filtro :</div>
            <div>
              <ReactSelect
                placeholder="Grupo"
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
                      label: "Todos (Grupo)",
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
                className="react-select-container text-sm w-[130px]"
                classNamePrefix="react-select"
              ></ReactSelect>
            </div>
            <div>
              <ReactSelect
                placeholder="Concepto "
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
                      name: "uidConcept",
                    },
                  })
                }
                name="uidConcept"
                options={
                  concepts &&
                  [
                    {
                      label: "Todos (Concepto)",
                      value: "",
                    },
                  ].concat(
                    concepts.map((i) => {
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
            <div className="flex items-center gap-1">
              <div
                className={`${
                  data.startDate ? "text-neutral-800" : "text-neutral-500"
                } h-[35px] w-[35px] rounded-md relative p-[6px] border border-neutral-400 hover:bg-neutral-100`}
              >
                <svg viewBox="0 0 24 24" fill="none" className="icon-stroke">
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M8 2V5"></path> <path d="M16 2V5"></path>{" "}
                    <path d="M3.5 9.08997H20.5"></path>{" "}
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"></path>{" "}
                    <path d="M15.6947 13.7H15.7037"></path>{" "}
                    <path d="M15.6947 16.7H15.7037"></path>{" "}
                    <path d="M11.9955 13.7H12.0045"></path>{" "}
                    <path d="M11.9955 16.7H12.0045"></path>{" "}
                    <path d="M8.29431 13.7H8.30329"></path>{" "}
                    <path d="M8.29431 16.7H8.30329"></path>{" "}
                  </g>
                </svg>
                <input
                  className={` absolute left-[-0px] opacity-0 text-[50px] w-full h-full top-0  cursor-pointer `}
                  type="date"
                  value={data.startDate ? data.startDate : ""}
                  onChange={(e) =>
                    setData({ ...data, startDate: e.target.value })
                  }
                />
              </div>
              <div className="text-xs">Hasta</div>
              <div
                className={`${
                  data.endDate ? "text-neutral-800" : "text-neutral-500"
                } h-[35px] w-[35px] rounded-md relative border-neutral-400 p-[6px] border hover:bg-neutral-100`}
              >
                <svg viewBox="0 0 24 24" fill="none" className="icon-stroke">
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M8 2V5"></path> <path d="M16 2V5"></path>{" "}
                    <path d="M3.5 9.08997H20.5"></path>{" "}
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"></path>{" "}
                    <path d="M15.6947 13.7H15.7037"></path>{" "}
                    <path d="M15.6947 16.7H15.7037"></path>{" "}
                    <path d="M11.9955 13.7H12.0045"></path>{" "}
                    <path d="M11.9955 16.7H12.0045"></path>{" "}
                    <path d="M8.29431 13.7H8.30329"></path>{" "}
                    <path d="M8.29431 16.7H8.30329"></path>{" "}
                  </g>
                </svg>
                <input
                  className={` absolute left-[-0px] opacity-0 text-[50px] w-full h-full top-0  cursor-pointer `}
                  type="date"
                  value={data.endDate ? data.endDate : ""}
                  onChange={(e) =>
                    setData({ ...data, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className=" w-[300px]">
              <div className="w-full">
                <div className="relative">
                  <input
                    onChange={(e) => setSearchkey(e.target.value)}
                    value={searchkey ? searchkey : ""}
                    data-toggle="dropdown"
                    placeholder="Buscar por DNI o Apellido Paterno"
                    type="text"
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
            {payments && payments.length > 0 ? (
              <ExcelFile
                filename={`Reporte - ${moment()
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
                <ExcelSheet
                  data={paymentsPrint}
                  name={`Filtrado por (${data.uidConcept ? "Concepto, " : ""}${
                    data.uidGroup ? "Grupo" : ""
                  })`}
                >
                  <ExcelColumn label="Codigo" value="code" />
                  <ExcelColumn label="Socio" value="member" />
                  <ExcelColumn label="Mes" value="date" />
                  <ExcelColumn label="Cuota" value="fee" />
                  <ExcelColumn label="Importe" value="imported" />
                  <ExcelColumn label="Deuda" value="debt" />
                  <ExcelColumn label="Concepto" value="concept" />
                  <ExcelColumn label="Fecha de Pago" value="payment_at" />
                  <ExcelColumn label="Hora" value="payment_hour_at" />
                  <ExcelColumn label="Modo de pago" value="paymentType" />
                  <ExcelColumn
                    label="Numero de Transacción"
                    value="codePaymentType"
                  />
                  <ExcelColumn label="Observaciones" value="observations" />
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
        <div>
          <InfiniteScroll
            next={fetchData}
            dataLength={payments && payments.length}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            hasMore={true}
            loader={<h4></h4>}
            scrollableTarget="scrollableDiv"
          >
            <div className=" w-full rounded-md max-w-full overflow-x-auto">
              <table className="w-full table ">
                <thead className="text-sm font-normal ">
                  <tr className="  dark:text-zinc-200  ">
                    <th className="mb-1 py-2 font-semibold w-[270px] min-w-[200px]  dark:bg-neutral-800   ">
                      <div className=" text-left">Miembro</div>
                    </th>
                    <th className=" font-semibold w-[200px] none-display-2 min-w-[150px] dark:bg-neutral-800  ">
                      <div className="text-left">Responsable</div>
                    </th>
                    <th className=" font-semibold w-[150px] min-w-[150px] dark:bg-neutral-800  ">
                      <div className="text-left">Fecha</div>
                    </th>
                    <th className=" font-semibold w-[200px] min-w-[200px] dark:bg-neutral-800 ">
                      <div className="text-left">Meses</div>
                    </th>
                    <th className=" font-semibold w-[100px] min-w-[100px] text-right pr-2 dark:bg-neutral-800  ">
                      Importe
                    </th>
                    <th className="font-semibold w-[100px] text-left pl-5 dark:bg-neutral-800  ">
                      <div>Tipo</div>
                    </th>
                    <th className=" none-display font-semibold w-[290px]  min-w-[290px]  text-left pl-4 dark:bg-neutral-800   rounded-r-md">
                      Observaciones
                    </th>
                    <th className="w-[100px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="999">
                        <div className="h-[200px] w-full flex items-center justify-center">
                          <Rotation width="60px" height="60px" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payments &&
                    payments.map((item, index) => (
                      <Opcy
                        onDoubleClick={() => {
                          setPayment(item);
                          setModalView(true);
                        }}
                        key={index}
                        className=" dark:text-neutral-300 hover:bg-[#f2f2f2] cursor-default transition-colors  text-[14px] border-t dark:border-t-neutral-800 "
                      >
                        <td className="px-2 py-[10px] relative rounded-l-sm">
                          <div className="flex items-center gap-1 dark: dark:text-neutral-100 font-semibold h-full">
                            <div className="w-[25px] min-w-[25px]">
                              <svg
                                className="icon-stroke"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.63996 20.59 3.08997 16.01 3.08997 11.12V6.72997C3.08997 5.90997 3.70998 4.97998 4.47998 4.66998L10.05 2.39001C11.3 1.88001 12.71 1.88001 13.96 2.39001L19.53 4.66998C20.29 4.97998 20.92 5.90997 20.92 6.72997L20.91 11.12Z"></path>
                                  <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z"></path>
                                  <path d="M12 12.5V15.5"></path>
                                </g>
                              </svg>
                            </div>
                            {upercasePrimaryLetter(
                              concatString([item.member.names])
                            )}
                          </div>
                          <div className="flex items-center gap-1 dark: dark:text-neutral-300 text-neutral-500 text-xs h-full">
                            Cuota mensual S/{" "}
                            {parseInt(item.member.totalFee).toFixed(2)}
                          </div>
                        </td>
                        <td className="none-display-2">
                          <div className="flex items-center gap-2">
                            <div className="w-[25px] min-w-[25px] h-[25px] overflow-hidden border rounded-full">
                              <img
                                className="object-cover w-full h-full"
                                src={item.userCreated.photo}
                                referrerPolicy="no-referrer"
                                alt=""
                              />
                            </div>
                            <div className="font-semibold text-xs">
                              {item.userCreated.names}
                              {item.userCreated.uid === userData.uid && " (Yo)"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {UppercasePrimaryLetter(
                              TimeAgoHourFormatSimple(item.payment_at)
                            )}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {UppercasePrimaryLetter(
                              TimeAgoHourFormat(item.payment_at)
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2 items-center flex-wrap">
                            {item.paymountList.slice(0, 3).map((i, index) => (
                              <div className="leading-3 flex " key={index}>
                                {dateOnName(i.date)}{" "}
                                {index < item.paymountList.length - 1 && ","}
                              </div>
                            ))}
                            <div>
                              {item.paymountList.length > 3 &&
                                `+${item.paymountList.length - 3}`}
                            </div>
                          </div>
                          <div className="text-xs text-neutral-500">
                            {item.concept.name}
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="dark:text-amber-100 text-neutral-700 font-semibold flex items-center gap-1">
                            <div className="ml-auto">
                              <div className="w-[6px] h-[6px] bg-green-600 rounded-full"></div>
                            </div>
                            <div className="ml-2 min-w-max">
                              S/ {item.totalImported.toFixed(2)}
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
                        <td className="text-left pl-5">
                          <div>
                            {item.paymentType === "cash" && "Efectivo"}{" "}
                            {item.paymentType === "electronicBankTransfers" &&
                              "Transferencia"}
                            {item.paymentType === "mobilePayments" &&
                              "Pago via Mobil"}
                          </div>
                          {item.paymentType === "electronicBankTransfers" && (
                            <div className="text-neutral-600 text-xs">
                              {item.codePaymentType}
                            </div>
                          )}
                        </td>
                        <td className="none-display text-left pl-5 ">
                          <div>
                            {item.observations.slice(0, 85)}
                            {item.observations.length > 85 && "..."}
                          </div>
                        </td>
                        <td className="rounded-r-sm ">
                          <TicketPaymount
                            Component={
                              <div className="flex max-w-min cursor-pointer bg-neutral-200 hover:bg-neutral-300 items-center gap-2 px-2 py-1 border rounded-md">
                                <div className="w-4">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="icon-stroke"
                                  >
                                    <g id="SVGRepo_iconCarrier">
                                      <path d="M7.25 7H16.75V5C16.75 3 16 2 13.75 2H10.25C8 2 7.25 3 7.25 5V7Z"></path>{" "}
                                      <path d="M16 15V19C16 21 15 22 13 22H11C9 22 8 21 8 19V15H16Z"></path>{" "}
                                      <path d="M21 10V15C21 17 20 18 18 18H16V15H8V18H6C4 18 3 17 3 15V10C3 8 4 7 6 7H18C20 7 21 8 21 10Z"></path>{" "}
                                      <path d="M17 15H15.79H7"></path>{" "}
                                      <path d="M7 11H10"></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                                <span className="text-sm min-w-max">
                                  Imprimir Boleta
                                </span>
                              </div>
                            }
                            Payment={item}
                          />
                        </td>
                      </Opcy>
                    ))
                  )}
                </tbody>
              </table>
              {payments && payments.length < 1 && (
                <div className="mx-auto text-center py-10 font-semibold text-zinc-400">
                  No hay nada que mostrar
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <Modal
        // onClickIframe={() => setModalAdd(!modalAdd)}
        show={modalAdd}
        close={() => setModalAdd(!modalAdd)}
      >
        <ContentModal width="500px">
          {/* <HeaderModal
            title={"Registra un nuevo pago"}
            btnRightOnclick={() => setModalAdd(!modalAdd)}
          /> */}
          <BodyModal>
            <FromPayment
              // data={paymentSelected}
              close={() => setModalAdd(!modalAdd)}
            />
          </BodyModal>
        </ContentModal>
      </Modal>

      <Modal
        onClickIframe={() => setModalView(!modalView)}
        show={modalView}
        close={() => setModalView(!modalView)}
      >
        <ContentModal width="500px">
          <BodyModal>
            <ViewPayment
              setClose={() => setModalView(!modalView)}
              data={payment}
            />
          </BodyModal>
        </ContentModal>
      </Modal>
    </Container>
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

const Container = styled.div`
  @media (max-width: 1000px) {
    padding: 5px;
    .none-display {
      display: none;
    }
  }
  @media (max-width: 1594px) {
    .none-display {
      display: none;
    }
  }
  @media (max-width: 1240px) {
    .none-display-2 {
      display: none;
    }
  }
`;
