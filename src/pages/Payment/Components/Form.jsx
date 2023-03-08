import { uuidv4 } from "@firebase/util";
import { limit, where } from "firebase/firestore";
import generateUniqueId from "generate-unique-id";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import styled from "styled-components";
import EclipseButton from "../../../components/Button/EclipseButton";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import Combobox from "../../../components/Form/ComboBox";
import TextField from "../../../components/Form/TextField";
import Rotation from "../../../components/Loader/Rotation";
import { useUser } from "../../../context/userContext";
import { FormatDate, TimeAgoHourFormatSimple } from "../../../helpers/moment";
import { concatString, upercasePrimaryLetter } from "../../../helpers/Other";
import { useToggle } from "../../../hooks/useToggle";
import { getDataConcepetsService } from "../../../services/Data/DataServices";
import {
  getMemberService,
  getMembersServiceSearsh,
  updateMemberService,
} from "../../../services/Member/MemberServices";
import {
  getPaymentItemsService,
  savePaymentsItemService,
} from "../../../services/Payment/PaymentItem";
import { savePaymentService } from "../../../services/Payment/PaymentServices";
import axios from "axios";
import TicketPaymount from "./Ticket";

export default function FromPayment(props) {
  const { userData } = useUser();
  const currentDate = new Date();


  const componentRef = useRef();
  const [print, setPrint] = useState(false);

  const [memberSelected, setMemberSelected] = useState(null);
  const [memberSelectedInter, setMemberSelectedInter] = useState(null);
  const [loading, setLoading] = useToggle(false);
  const [data, setData] = useState(
    props.data
      ? props.data
      : {
          observations: "",
          paymentType: "cash",
          codePaymentType: "",
        }
  );

  const [wrapper, setWrapper] = useState("index");
  const [searchkey, setSearchkey] = useState(null);

  const [members, setMembers] = useState(null);
  const [concept, setConcept] = useState(null);
  const [promotion, setPromotion] = useState(null);

  const [concepts, setConcepts] = useState(null);

  const [paymountList, setPaymountList] = useState([]);
  const [lastPayments, setLastPayments] = useState(null);
  const [lastPaymentsIsPromotion, setLastPaymentsIsPromotion] = useState(null);

  const billHeader =
    "M-" +
    generateUniqueId({
      length: 6,
      useLetters: false,
    });
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

  const {
    handleSubmit,
    control,
    setError,
    register,
    setValue,
    clearErrors,
    unregister,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...data,
    },
    mode: "onChange",
  });
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    const uid = uuidv4();

    concepts.forEach((concept) => {
      if (concept.uid === data.uidConcept) {
        conceptSelected = concept;
      }
    });
    let list = [];
    await Promise.all(
      paymountList.map(async (item) => {
        const bill = `P-${generateUniqueId({
          length: 7,
          useLetters: false,
        })}`;
        let newItem = {
          ...item,
          headerUid: uid,
          created_at: FormatDate(),
          imported: item.paid ? item.paid.debt : parseInt(item.imported),
          fee: parseInt(memberSelected.totalFee),
          debt: item.paid
            ? item.debt
            : item.promotion
            ? 0
            : parseInt(memberSelected.totalFee) - item.imported,
          concept: {
            uid: concept?.uid,
          },
          member: {
            uid: memberSelected?.uid,
            groupUid: memberSelected?.group.uid,
            // names: `${memberSelected?.lastName} ${memberSelected?.motherLastName}, ${memberSelected?.names}`,
          },
        };
        delete newItem.uid;
        if (item.paid) {
          if (item.paid.debt > 0) {
            delete newItem.paid;
            const itemReturn = await savePaymentsItemService(newItem);
            list.push({
              uid: itemReturn,
              date: newItem.date,
              observation: newItem.promotion
                ? newItem.promotion.reason
                : newItem.observation,
              debt: newItem.debt,
              imported: item.paid ? item.paid.debt : item.imported,
              billNumber: bill,
            });
          }
        } else {
          delete newItem.paid;
          const itemReturn = await savePaymentsItemService(newItem);
          list.push({
            uid: itemReturn,
            date: newItem.date,
            observation: newItem.promotion
              ? newItem.promotion.reason
              : newItem.observation,
            debt: newItem.debt,
            imported: item.paid ? item.paid.debt : item.imported,
            billNumber: bill,
          });
        }
      })
    );
    const newData = {
      ...data,
      paymountList: list,
      billHeader: billHeader,
      payment_at: FormatDate(),
      metadata: await getInfo(),
      member: {
        uid: memberSelected?.uid,
        dni: memberSelected?.dni,
        totalFee: memberSelected?.totalFee,
        statu: memberSelected?.statu,
        names: `${memberSelected?.lastName} ${memberSelected?.motherLastName}, ${memberSelected?.names}`,
        group: memberSelected?.group,
      },
      userCreated: {
        names: userData.name,
        uid: userData.uid,
        photo: userData.photoUrl,
      },
      concept: {
        name: concept?.name,
        uid: concept?.uid,
      },
    };
    await savePaymentService(newData, uid, userData);
    if (promotion && promotion.promotion === "1") {
      let newMember = {
        ...memberSelected,
        promotionUltimate: promotion.date,
      };
      delete newMember.uid;
      await updateMemberService(newMember, memberSelected.uid, userData);
    }
    await setData({
      ...newData,
      billHeader: billHeader,
    });
    setPrint(true);
  };

  async function getInfo() {
    let metadata = {};
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      metadata = {
        ...metadata,
        ip: response.data.ip,
      };
    } catch (error) {
      console.error(error);
    }
    metadata = {
      ...metadata,
      appName: navigator.appName,
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      appVersion: navigator.appVersion,
      appCodeName: navigator.appCodeName,
    };
    return metadata;
  }

  const addNewItem = (index) => {
    const uid = uuidv4();
    let date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + index
    );

    if (inDuplicate(date.toISOString().substr(0, 10).slice(0, 7))) {
      addNewItem(index + 1);
      return;
    }

    const last = searshExistPayment(
      date.toISOString().substr(0, 10).slice(0, 7)
    );
    const newArrayItem = [];

    let newItem = {
      uid,
      date: date.toISOString().substr(0, 10).slice(0, 7),
      observation: last ? last.observations : "",
      fee: memberSelected.totalFee,
      imported:
        last && last.debt > 0 ? last.debt : parseInt(memberSelected.totalFee),
      debt: 0,
      paid: last ? last : false,
    };
    if (
      promotion &&
      promotion.date === date.toISOString().substr(0, 10).slice(0, 7)
    ) {
      newItem = {
        ...newItem,
        promotion: {
          reason: whatIsPromotion(promotion.promotion),
          promotion: promotion.promotion,
        },
        imported:
          parseInt(memberSelected.totalFee) -
          parseInt(memberSelected.totalFee) * promotion.promotion,
      };
    }
    newArrayItem.push(newItem);
    const newArray = paymountList ? paymountList : [];
    setPaymountList(newArray.concat(newArrayItem));
  };

  function whatIsPromotion(promotion) {
    if (promotion === "0.25") {
      return "25% de descuento por pago puntual de 3 meses";
    }
    if (promotion === "0.45") {
      return "45% de descuento por pago puntual de 6 meses";
    }
    return "100% de descuento por pago puntual de 11 meses";
  }

  useEffect(() => {
    if (memberSelectedInter) {
      getMemberService(setMemberSelected, memberSelectedInter.uid);
    }
    setPaymountList([]);
  }, [memberSelectedInter]);

  useEffect(() => {
    if (memberSelected && concept) {
      getPaymentItemsService(setLastPayments, [
        where("member.uid", "==", memberSelectedInter.uid),
        where("concept.uid", "==", concept?.uid),
      ]);
    }
    setPaymountList([]);
  }, [concept, memberSelectedInter]);

  useEffect(() => {
    // getMembersServiceSearsh(setMembers, [limit(5)]);
    getDataConcepetsService(setConcepts);
  }, []);

  useEffect(() => {
    if (data.paymentType === "electronicBankTransfers") {
      register("paymentType", { required: true });
    } else {
      unregister("paymentType");
      clearErrors();
    }
  }, [data.paymentType]);

  useEffect(() => {
    let newCon = [];
    if (searchkey && !isNumeric(searchkey)) {
      newCon.push(where("lastName", ">=", searchkey.toUpperCase()));
      newCon.push(where("lastName", "<=", searchkey.toUpperCase() + "~"));
    } else if (searchkey && isNumeric(searchkey)) {
      newCon.push(where("dni", ">=", searchkey));
      newCon.push(where("dni", "<=", searchkey + "~"));
    }
    newCon.push(limit(5));
    getMembersServiceSearsh(setMembers, newCon);
  }, [searchkey]);

  useEffect(() => {}, []);
  function isNumeric(num) {
    return !isNaN(num);
  }

  const endComponent = () => {
    props.close();
  };

  function removerPorIndice(indice) {
    let index = paymountList.indexOf(indice);
    const newList = [
      ...paymountList.slice(0, index),
      ...paymountList.slice((index += 1), paymountList.length),
    ];
    setPaymountList(newList);
  }

  const handleChangeArrayItem = (e, item) => {
    const newList = [];
    paymountList.forEach((paymount) => {
      if (paymount.uid === item.uid) {
        if (e.target.name === "imported") {
          newList.push({
            ...item,
            imported:
              e.target.value <= memberSelected.totalFee && e.target.value >= 1
                ? e.target.value
                : item.imported,
          });
        } else {
          newList.push({
            ...item,
            [e.target.name]: e.target.value,
          });
        }
      } else {
        newList.push(paymount);
      }
    });
    setPaymountList(newList);
  };

  const onChangeDate = (e, item) => {
    if (inDuplicate(e.target.value)) {
      toast((t) => (
        <div>
          <div className="text-sm">Fecha en uso </div>
        </div>
      ));
    } else {
      const newList = [];
      paymountList.forEach((paymount) => {
        let newItem = {};

        if (paymount.uid === item.uid) {
          newItem = {
            ...item,
            [e.target.name]: e.target.value,
            paid: searshExistPayment(e.target.value)
              ? searshExistPayment(e.target.value)
              : false,
          };

          if (promotion && promotion.date === e.target.value) {
            newItem = {
              ...newItem,
              promotion: {
                reason: whatIsPromotion(promotion.promotion),
                promotion: promotion.promotion,
              },
              imported:
                parseInt(memberSelected.totalFee) -
                parseInt(memberSelected.totalFee) * promotion.promotion,
            };
          } else {
            delete newItem.promotion;
          }
        } else {
          newItem = paymount;
        }
        newList.push(newItem);
      });
      setPaymountList(newList);
    }
  };

  const searshExistPayment = (date) => {
    let statu = null;
    const lists = [];

    lastPayments &&
      lastPayments
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .forEach((p) => {
          if (p.date.slice(0, 7) === date) {
            lists.push(p);
          }
        });

    if (lists.length === 1) {
      statu = {
        statu: true,
        observations:
          lists[0].debt > 0 ? `Importe anterior S/ ${lists[0].imported}` : "",
        ...lists[0],
      };
    } else if (lists.length > 1) {
      let item = lists[lists.length - 1];
      statu = {
        statu: true,
        observations:
          lists[0].debt > 0
            ? `Importe anterior S/ ${lists[lists.length - 1].imported}`
            : "",
        ...item,
      };
    }

    return statu;
  };

  const inDuplicate = (date) => {
    let statu = false;
    paymountList.forEach((paymount) => {
      if (paymount.date === date) {
        statu = true;
      }
    });
    return statu;
  };

  //total imported
  useEffect(() => {
    let total = 0;
    if (paymountList) {
      paymountList.forEach((paymount) => {
        if (!paymount.paid) {
          total += paymount.imported ? parseFloat(paymount.imported) : 0;
        } else {
          total += paymount.paid ? parseFloat(paymount.paid.debt) : 0;
        }
      });
    }
    setData({
      ...data,
      totalImported: total,
    });
    isPromotion();
  }, [paymountList, lastPayments]);

  // get is lastpayments from promotion
  useEffect(() => {
    if (memberSelected && concept && memberSelected.promotionUltimate) {
      getPaymentItemsService(setLastPaymentsIsPromotion, [
        where("member.uid", "==", memberSelectedInter.uid),
        where("concept.uid", "==", concept?.uid),
        where("date", ">", memberSelected.promotionUltimate),
        limit(15),
      ]);
      isPromotion();
    } else if (memberSelected && concept) {
      getPaymentItemsService(setLastPaymentsIsPromotion, [
        where("member.uid", "==", memberSelectedInter.uid),
        where("concept.uid", "==", concept?.uid),
        limit(15),
      ]);
      isPromotion();
    }
  }, [concept, memberSelectedInter]);
  const isPromotion = () => {
    let listDate = [];
    let current = null;
    let resultNum = 0;

    if (lastPaymentsIsPromotion && lastPaymentsIsPromotion.length >= 3) {
      current = new Date(lastPaymentsIsPromotion[0].date);
      listDate.push(current.toISOString().substr(0, 10).slice(0, 7));
      for (let i = 0; i < lastPaymentsIsPromotion.length; i++) {
        let date = new Date(current.getFullYear(), current.getMonth() - i)
          .toISOString()
          .substr(0, 10)
          .slice(0, 7);
        listDate.push(date);
      }
    }

    listDate.forEach((date) => {
      if (isExistTwo(date)) {
        resultNum += 1;
      }
    });

    function isExistTwo(date) {
      let statu = false;
      lastPaymentsIsPromotion.forEach((item) => {
        if (item.date === date && item.debt <= 0) {
          statu = true;
          return false;
        }
      });
      return statu;
    }
    if (resultNum === 3) {
      setPromotion({
        promotion: "0.25",
        date: new Date(current.getFullYear(), current.getMonth() + 2)
          .toISOString()
          .substr(0, 10)
          .slice(0, 7),
      });
    } else if (resultNum === 6) {
      setPromotion({
        promotion: "0.45",
        date: new Date(current.getFullYear(), current.getMonth() + 2)
          .toISOString()
          .substr(0, 10)
          .slice(0, 7),
      });
    } else if (resultNum === 11) {
      setPromotion({
        promotion: "1",
        date: new Date(current.getFullYear(), current.getMonth() + 2)
          .toISOString()
          .substr(0, 10)
          .slice(0, 7),
      });
    } else {
      setPromotion(null);
    }
  };

  return (
    <div className=" h-full flex flex-col">
      {/* Home Panel */}
      {wrapper === "index" && (
        <div className=" h-full flex-col flex">
          {/* header */}
          <div className="flex flex-col pb-2">
            <div className="flex items-center">
              <h1 className="mr-auto leading-8 text-2xl font-bold tracking-tight dark:text-neutral-200">
                Registra
              </h1>
              <div>
                <EclipseButton
                  onClick={props.close}
                  type="default"
                  size="medium"
                  icon={
                    <svg
                      className=" dark:text-zinc-300"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289Z"
                        fill="currentColor"
                        style={{
                          strokeWidth: "0",
                        }}
                      ></path>
                    </svg>
                  }
                />
              </div>
            </div>
            <span className="leading-4 flex mt-1 text-xs dark:text-neutral-400">
              Los datos como el usuario, la fecha, y algunas informaciones del
              navegador utilizado seran guardados por seguridad.
            </span>
          </div>
          {/* button add member */}
          <div
            role="button"
            onClick={() => setWrapper("member")}
            tabIndex="0"
            className={` ${
              memberSelected
                ? "dark:text-green-500 text-green-700 font-semibold dark:bg-neutral-700  bg-neutral-200 hover:bg-neutral-300 animate-none"
                : "dark:text-neutral-50 bg-neutral-300 dark:bg-neutral-700 animate-pulse text-neutral-800"
            } w-full h-9 flex items-center justify-center gap-2  dark:hover:bg-neutral-600  pl-2  cursor-pointer hover:bg-zinc-200 p-1 py-1 rounded-md`}
          >
            {!memberSelected && (
              <div className="w-6">
                <svg className="icon-stroke" viewBox="0 0 24 24" fill="none">
                  <g id="SVGRepo_iconCarrier">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>{" "}
                    <path d="M8 12H16"></path> <path d="M12 16V8"></path>{" "}
                  </g>
                </svg>
              </div>
            )}

            {memberSelected ? (
              <>
                <span className="text-sm text-neutral-800 dark:text-neutral-400">
                  Miembro:
                </span>
                <span className="text-sm">
                  {upercasePrimaryLetter(
                    concatString([
                      memberSelected.lastName,
                      memberSelected.motherLastName + ", ",
                      memberSelected.names,
                    ])
                  )}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold">
                Seleccionar un socio
              </span>
            )}
          </div>
          {/* panel a member selected */}
          {memberSelected && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 mt-2">
                  <div className="w-full">
                    <div
                      role="button"
                      onClick={() => setWrapper("concept")}
                      tabIndex="0"
                      className={` ${
                        concept
                          ? "dark:text-green-500 text-green-700  font-semibold dark:hover:bg-blue-600 bg-neutral-200 hover:bg-neutral-300 animate-none"
                          : "dark:text-neutral-300 bg-neutral-300 animate-pulse text-neutral-800"
                      } dark:bg-neutral-700 w-full h-9 flex items-center justify-center gap-2  dark:hover:bg-neutral-600  pl-2  cursor-pointer hover:bg-zinc-200 p-1 py-1 rounded-md`}
                    >
                      {!concept && (
                        <div className="w-6">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="icon-stroke"
                          >
                            <g id="SVGRepo_iconCarrier">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>{" "}
                              <path d="M10.74 15.53L14.26 12L10.74 8.46997"></path>{" "}
                            </g>
                          </svg>
                        </div>
                      )}

                      {concept ? (
                        <>
                          <span className="text-sm text-neutral-800 dark:text-neutral-400">
                            Concepto:
                          </span>
                          <span className="text-sm">
                            {upercasePrimaryLetter(concept.name)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm">
                          Seleccionar un concepto"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* {paymountList && ( */}
              {memberSelected && concept && (
                <div className="max-w-full overflow-x-auto scrollbarhovercontent">
                  {/* {paymountList.length > 0 && ( */}
                  <div className=" flex  flex-col gap-1 ">
                    <table className=" max-h-[600px] dark:scrollbar-thumb-[#7374750c] dark:scrollbar-track-[#318191a]  overflow-y-auto">
                      <thead>
                        <tr className="text-neutral-500 dark:text-neutral-200 text-xs 3">
                          <th className="font-semibold p-2  text-left w-[140px] sticky left-0 dark:bg-[#292a2b] bg-[#ffffff]">
                            Mes
                          </th>
                          <th className="font-semibold text-left px-1 w-[100px]">
                            Importe
                          </th>
                          <th className="font-semibold text-left px-1 max-w-[100px]">
                            Deuda
                          </th>

                          <th className="font-semibold text-right px-1 w-[40px]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymountList.map((item, index) => (
                          <Tr
                            className="border-t dark:border-t-neutral-600 text-sm cursor-default hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-neutral-300"
                            key={index}
                          >
                            <td className="p-[6px] w-[140px] sticky left-0   ">
                              <input
                                type="month"
                                onChange={(e) => onChangeDate(e, item)}
                                value={item.date}
                                name="date"
                                className="text-xs appearance-none w-full cursor-pointer h-full p-2 rounded-[4px] bg-neutral-200 hover:bg-neutral-300 outline-none dark:bg-transparent transition-colors focus:border-blue-600"
                              ></input>
                            </td>
                            {item.paid ? (
                              <>
                                {item.paid.debt > 0 ? (
                                  <>
                                    <td className="text-left px-1 w-[100px]">
                                      <input
                                        className="w-full text-xs h-full p-2 rounded-[4px] bg-transparent outline-none  transition-colors focus:border-blue-600 border border-neutral-400"
                                        type="number"
                                        name="imported"
                                        disabled="true"
                                        value={item.imported}
                                      />
                                    </td>
                                    <td colSpan="" className="px-2">
                                      <div className="text-neutral-800 text-xs pl-2 flex items-center gap-2">
                                        {/* <div>
                                          S/ {item.paid.imported.toFixed(2)}{" "}
                                          {TimeAgoHourFormatSimple(
                                            item.paid.created_at
                                          )}
                                        </div>
                                        Deuda S/ {item.paid.debt.toFixed(2)}, */}
                                        {item.observation}
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <td colSpan="2">
                                    <div className="pl-2 flex text-neutral-800 text-xs font-semibold items-center gap-2">
                                      <div>
                                        Cancelado{" "}
                                        {TimeAgoHourFormatSimple(
                                          item.paid.created_at
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                )}
                              </>
                            ) : (
                              <>
                                <td className="text-left px-1 w-[100px]">
                                  <input
                                    className="w-full text-xs h-full p-2 rounded-[4px] bg-transparent outline-none  transition-colors focus:border-blue-600 border border-neutral-400"
                                    type="number"
                                    name="imported"
                                    disabled={item.promotion ? true : false}
                                    onChange={(e) =>
                                      handleChangeArrayItem(e, item)
                                    }
                                    value={item.imported}
                                  />
                                </td>
                                <td className="text-left px-1 dark:text-neutral-300 text-neutral-700">
                                  {item.promotion ? (
                                    <div className="text-xs">
                                      {item.promotion
                                        ? item.promotion.reason
                                        : ""}
                                    </div>
                                  ) : (
                                    <div className="min-w-max text-xs">
                                      {"S/ " +
                                        (
                                          memberSelected.totalFee -
                                          item.imported
                                        ).toFixed(2)}
                                    </div>
                                  )}
                                </td>
                              </>
                            )}
                            <td className="text-center ">
                              <div
                                role="button"
                                onClick={() => removerPorIndice(item)}
                                tabIndex="0"
                                className=" border w-[25px] h-[25px]  border-neutral-400 hover:border-neutral-600  p-[2px] rounded-full"
                              >
                                <div className="w-full h-full">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="icon-stroke "
                                  >
                                    <g id="SVGRepo_iconCarrier">
                                      <path
                                        style={{
                                          strokeWidth: "1px",
                                        }}
                                        d="M6 12H18"
                                      ></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </td>
                          </Tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* )} */}
                </div>
              )}
              {memberSelected && concept && (
                <div className="sticky left-0 my-2 ml-2  flex items-center">
                  <div
                    role="button"
                    onClick={() =>
                      addNewItem(paymountList ? paymountList.length : 0)
                    }
                    tabIndex="0"
                    className={`font-semibold max-w-min hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 py-1 px-3 text-neutral-700 dark:text-neutral-100  text-sm hover:underline w-full flex items-center gap-2  cursor-pointer rounded-md`}
                  >
                    <div className="w-6  border border-neutral-700 dark:border-neutral-500 rounded-full">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="icon-stroke "
                      >
                        <g id="SVGRepo_iconCarrier">
                          <path
                            style={{
                              strokeWidth: "1px",
                            }}
                            d="M6 12H18"
                          ></path>
                          <path
                            style={{
                              strokeWidth: "1px",
                            }}
                            d="M12 18V6"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div>Agregar</div>
                  </div>
                  <div className="min-w-max  ml-auto font-semibold dark:text-neutral-100 text-sm">
                    Total S/ {data.totalImported.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {iframe in not member selected} */}
          {!memberSelected && (
            <div className="p-10 text-center">
              <img
                className="w-60 select-none mx-auto my-5 pointer-events-none"
                draggable="false"
                src="/assets/1.png"
                alt=""
              />
              <h6 className="mt-[-1px] text-sm text-neutral-400">
                Para registrar un pago primero debes seleccionar un socio
              </h6>
            </div>
          )}

          {/* {iframe in not concept selected} */}
          {memberSelected && !concept && (
            <div className="p-10 text-center">
              <h6 className="mt-[-1px] text-sm text-neutral-400">
                Elige un concepto para continuar
              </h6>
            </div>
          )}

          {/* button submit */}
          <div className="mt-2">
            {memberSelected && concept && data.totalImported > 0 ? (
              <PrimaryButton
                // onClick={handleSubmit(onSubmit)}
                onClick={() => setWrapper("finaly")}
                type="primary_transparent"
              >
                Siguiente
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onClick={() => endComponent()}
                type="primary_transparent"
              >
                Salir
              </PrimaryButton>
            )}
          </div>
        </div>
      )}

      {/* panel Member */}
      {wrapper === "member" && (
        <div>
          {/* header */}
          <div className="flex items-center gap-2 pb-2">
            <EclipseButton
              onClick={() => setWrapper("index")}
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
            <h1 className="leading-8 text-2xl font-bold tracking-tight dark:text-neutral-200">
              Selecciona un socio activo
            </h1>
          </div>
          {/* searsh input */}
          <div className="my-2">
            <div className="w-full">
              <div className="relative">
                <input
                  data-toggle="dropdown"
                  onChange={(e) => setSearchkey(e.target.value)}
                  placeholder="Buscar por DNI o Apellido Paterno"
                  type="text"
                  value={searchkey ? searchkey : ""}
                  className="px-4 pl-7 text-sm w-full  h-[35px] flex items-center justify-center py-1 outline-none dark:bg-[#7e7e7e36] bg-[#a8a8a836] dark:hover:bg-[#7e7e7e5b] hover:bg-[#a8a8a81a] transition-colors dark:text-[#ffffff] rounded-full"
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
          {/* {list members} */}
          <div className="flex flex-col gap-1 pb-3 toolbar" role="toolbar">
            {members &&
              members.map((member, index) => (
                <div
                  onClick={() => {
                    member.statu && setMemberSelectedInter(member);
                    member.statu && setWrapper("index");
                  }}
                  // onKeyDown={() => {
                  //   member.statu && setMemberSelectedInter(member);
                  //   member.statu && setWrapper("index");
                  // }}
                  aria-disabled={member.statu}
                  tabIndex={member.statu ? "0" : "-1"}
                  tooltip={!member.statu ? "Inactivo" : null}
                  key={index}
                  className={`${
                    memberSelectedInter &&
                    memberSelectedInter.uid === member.uid &&
                    "dark:bg-neutral-700 bg-neutral-200"
                  } ${
                    !member.statu
                      ? "dark:text-neutral-500 cursor-default "
                      : "cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-100 dark:focus:bg-neutral-700 dark:text-neutral-100"
                  } flex items-center gap-2 p-1   transition-colors rounded-lg outline-none`}
                >
                  <div className="w-[35px] h-[35px] overflow-hidden rounded-full">
                    <img
                      className={`${
                        !member.statu && "opacity-30"
                      } object-cover h-full w-full`}
                      src="https://qph.cf2.quoracdn.net/main-qimg-2b21b9dd05c757fe30231fac65b504dd"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 leading-6 font-semibold text-[14px] ">
                      {/* {miOracion.replace(/(^\w{1})|(\s+\w{1})/g, member.lastName + member.motherLastName + member.names => letra.toUpperCase());} */}
                      {upercasePrimaryLetter(
                        concatString([
                          member.lastName,
                          member.motherLastName + ", ",
                          member.names,
                        ])
                      )}
                    </div>
                  </div>
                  <div className="ml-auto pr-1">
                    <div
                      className={`${
                        memberSelectedInter &&
                        memberSelectedInter.uid === member.uid
                          ? " dark:border-blue-500 border-blue-500"
                          : "dark:border-neutral-400 border-neutral-400"
                      } border  w-[20px] h-[20px] rounded-full flex items-center justify-center`}
                    >
                      <div
                        className={`w-[10px] h-[10px] ${
                          memberSelectedInter &&
                          memberSelectedInter.uid === member.uid &&
                          "bg-blue-500"
                        } rounded-full`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            {members && members.length < 1 && (
              <div className="text-center py-16 px-10 flex flex-wrap dark:text-neutral-300">
                <p>
                  No se encontro ningun miembro con el Apellido o DNI "
                  <b>{searchkey}</b>"
                </p>
              </div>
            )}
          </div>
          {/* button submit */}
          <div>
            <PrimaryButton
              onClick={() => setWrapper("index")}
              type="primary_transparent"
            >
              <span>Aceptar</span>
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* panel concept */}

      {wrapper === "concept" && (
        <div>
          {/* header */}
          <div className="flex items-center gap-2 pb-2">
            <EclipseButton
              onClick={() => setWrapper("index")}
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
            <h1 className="leading-8 text-2xl font-bold tracking-tight dark:text-neutral-200">
              Selecciona un concepto
            </h1>
          </div>
          {/* {list concepts} */}
          <div className="flex flex-col gap-1 pb-3 toolbar" role="toolbar">
            {concepts &&
              concepts.map((item, index) => (
                <div
                  onClick={() => {
                    item.statu && setConcept(item);
                    item.statu && setWrapper("index");
                  }}
                  // onKeyDown={() => {
                  //   member.statu && setMemberSelectedInter(member);
                  //   member.statu && setWrapper("index");
                  // }}
                  aria-disabled={item.statu}
                  tabIndex={item.statu ? "0" : "-1"}
                  tooltip={!item.statu ? "Inactivo" : null}
                  key={index}
                  className={`${
                    concept &&
                    concept.uid === item.uid &&
                    "dark:bg-neutral-700 bg-neutral-200"
                  } ${
                    !item.statu
                      ? "dark:text-neutral-500 text-neutral-500 cursor-default "
                      : "cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-100 dark:focus:bg-neutral-700 dark:text-neutral-100"
                  } flex items-center gap-2 p-1 py-2   transition-colors rounded-lg outline-none`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 leading-6 font-semibold text-[14px] ">
                      {upercasePrimaryLetter(item.name)}
                    </div>
                  </div>
                  <div className="ml-auto pr-1">
                    <div
                      className={`${
                        concept && concept.uid === item.uid
                          ? " dark:border-blue-500 border-blue-500"
                          : "dark:border-neutral-400 border-neutral-400"
                      } border  w-[20px] h-[20px] rounded-full flex items-center justify-center`}
                    >
                      <div
                        className={`w-[10px] h-[10px] ${
                          concept && concept.uid === item.uid && "bg-blue-500"
                        } rounded-full`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            {members && members.length < 1 && (
              <div className="text-center py-16 px-10 flex flex-wrap dark:text-neutral-300">
                <p>
                  No se encontro ningun miembro con el Apellido o DNI "
                  <b>{searchkey}</b>"
                </p>
              </div>
            )}
          </div>
          {/* button submit */}
          <div>
            <PrimaryButton
              onClick={() => setWrapper("index")}
              type="primary_transparent"
            >
              <span>Aceptar</span>
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* panel finaly */}

      {wrapper === "finaly" && (
        <div>
          {/* header */}
          <div className="flex items-center gap-2 pb-2">
            <EclipseButton
              onClick={() => setWrapper("index")}
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
            <h1 className="leading-8 text-2xl font-bold tracking-tight dark:text-neutral-200">
              Finalizar pago
            </h1>
          </div>

          {/* user info */}

          <div className="my-2 flex items-center gap-2">
            <div className="w-[35px] h-[35px] rounded-full overflow-hidden ">
              <img
                className="object-cover h-full w-full"
                referrerPolicy="no-referrer"
                src={userData.photoUrl}
                alt=""
              />
            </div>
            <div className="font-semibold flex flex-col text-neutral-900 dark:text-neutral-200">
              <span className="leading-4 ">{userData.name}</span>
              <span className="leading-4 text-xs font-normal dark:text-neutral-400 ">
                {moment().format("LL")}
              </span>
            </div>
          </div>

          {/* {Body} */}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="w-full">
                <Combobox
                  className="outline-none w-full text-sm h-10 flex items-center justify-center gap-2 text-neutral-50 pl-2 cursor-pointer hover:bg-zinc-200 dark:bg-neutral-700 bg-zinc-100  dark:hover:bg-neutral-600 p-1 py-1 rounded-lg"
                  name="paymentType"
                  onChange={handleChange}
                  long
                  info="Foma de pago"
                  control={control}
                  value={data.paymentType}
                  error={errors.paymentType}
                  id=""
                >
                  <option value="cash">Efectivo</option>
                  <option value="mobilePayments">Yape, Plin, Etc.</option>
                  <option value="electronicBankTransfers">
                    Transferencia Bancaria
                  </option>
                </Combobox>
              </div>
              {data.paymentType === "electronicBankTransfers" && (
                <div className="w-full">
                  <TextField
                    info={"Numero de transferencia"}
                    requiredName="Ingrese el numero de transferencia"
                    minName="El monto minimo es 1"
                    placeholder=""
                    type="text"
                    long
                    onChange={handleChange}
                    value={data.codePaymentType}
                    error={errors.codePaymentType}
                    control={control}
                    name="codePaymentType"
                    rules={{
                      min: 0,
                      required: true,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="w-full">
                <TextField
                  multiple
                  info={"Observaciones general"}
                  maxLengthName="Maximo 255"
                  type="text"
                  long
                  onChange={handleChange}
                  value={data.observations}
                  error={errors.observations}
                  control={control}
                  name="observations"
                  rules={{
                    maxLength: 255,
                  }}
                />
              </div>
            </div>
            <div className="p-1 flex items-center gap-2 dark:text-neutral-400 text-neutral-700">
              <span className="text-sm">Importe Total: </span>
              <span className="font-bold text-xl">
                S/ {data.totalImported.toFixed(2)}
              </span>
            </div>
          </div>
          {print && (
            <TicketPaymount FinallyFunction={endComponent} Payment={data} />
          )}
          {/* button submit */}

          <div className="mt-2">
            <PrimaryButton
              disabled={Object.entries(errors).length > 0 ? true : false}
              onClick={handleSubmit(onSubmit)}
              // onClick={() => {
              //   setShowPdfModal(!showPdfModal);
              //   handlePrint();
              // }}
              type="primary_transparent"
            >
              Guardar pago y generar boleta
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* loading  */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,.5)] dark:bg-[rgba(6,7,7,0.5)]">
          <div className="w-full h-full flex items-center justify-center">
            <Rotation width="60px" height="60px" />
          </div>
        </div>
      )}
    </div>
  );
}

const Tr = styled.tr``;
