import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import styled from "styled-components";
import EclipseButton from "../../../components/Button/EclipseButton";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import CheckBox from "../../../components/Form/CheckBox";
import Combobox from "../../../components/Form/ComboBox";
import PhotoForm from "../../../components/Form/PhotoForm";
import TextField from "../../../components/Form/TextField";
import ImageCustomMeta from "../../../components/ImageCustomMeta";
import Rotation from "../../../components/Loader/Rotation";
import { useUser } from "../../../context/userContext";
import { FormatDate } from "../../../helpers/moment";
import { useObject } from "../../../hooks/useObject";
import { useToggle } from "../../../hooks/useToggle";
import {
  getDataGeadquartersService,
  getDataGroupsService,
} from "../../../services/Data/DataServices";
import { uploadImage } from "../../../services/Image/ImageServices";
import {
  saveMemberService,
  updateMemberService,
} from "../../../services/Member/MemberServices";

export default function FormMember(props) {
  const [data, setData] = useObject(
    props.data
      ? props.data
      : {
          dni: "",
          names: "",
          lastName: "",
          motherLastName: "",
          observations: "",
          verify: false,
          statu: true,
          groupUid: null,
          day: 1,
          month: 1,
          year: 2023,
          geadquarterUid: null,
          memberFee: "30.00",
          bookletFee: "2.00",
          celebrationFee: "3.00",
          totalFee: "40.00",

          younger: false,
          attorney: "",
          phone: "",
          dischargeDate: "",
          entryDate: "",
        }
  );
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

  const { userData } = useUser();

  const [loading, setLoading] = useToggle(false);
  const [loadingRuc, setLoadingRuc] = useToggle(false);
  const [groups, setGroups] = useObject(null);
  const [geadquarters, setGeadquarters] = useObject(null);
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [filesData, setFilesData] = useState(
    props.data ? props.data.files : null
  );

  let currentYear = new Date().getFullYear();

  let days = [];
  let years = [];
  const monthsDate = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const getDate = () => {
    for (let year = currentYear; year >= 1905; year--) {
      years.push(year);
    }

    for (let day = 1; day <= 31; day++) {
      days.push(day);
    }
  };
  getDate();

  // handles
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = async () => {
    if (isYear(data.year) < 19 && !data.younger) {
      setError("year", { type: "custom", message: "Menor de Edad" });
      return;
    }

    setLoading(true);
    let geadquartersFinal = null;
    let groupFinal = null;
    let filesFinal = [];

    geadquarters.forEach((item) => {
      if (item.uid == data.geadquarterUid) {
        geadquartersFinal = {
          uid: item.uid,
          name: item.name,
          address: item.address,
        };
      }
    });
    //  get item group
    groups.forEach((item) => {
      if (item.uid == data.groupUid) {
        groupFinal = {
          uid: item.uid,
          name: item.name,
        };
      }
    });

    // images list
    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const result = await uploadImage(file.file);
          filesFinal.push({
            ...result,
            description: file.description ? file.description : "",
          });
        })
      );
    }

    let newData = {
      ...data,
      geadquarter: geadquartersFinal,
      group: groupFinal,
      files: !filesData
        ? filesFinal
        : filesFinal.concat(filesData && filesData),
      names: data.names.toUpperCase(),
      lastName: data.lastName.toUpperCase(),
      motherLastName: data.motherLastName.toUpperCase(),
    };

    //  if exist data
    if (props.data) {
      delete newData.uid;
      newData = {
        ...newData,
        updated_user: userData.uid,
        update_at: FormatDate(),
        updated_statu_at:
          props.data.statu != data.statu
            ? {
                user_name: userData.name,
                user_role: userData.role,
                user_uid: userData.uid,
                date: FormatDate(),
              }
            : props.data.updated_statu_at
            ? props.data.updated_statu_at
            : null,
      };
      await updateMemberService(newData, props.data.uid, userData);
      toast.success("Miembro Actualizado", {
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
    }
    //  if no exist data
    else {
      newData = {
        ...newData,
        created_at: FormatDate(),
        created_user: userData.uid,
      };
      await saveMemberService(newData, userData);
      toast.success("Miembro Agregado", {
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
    }
    setLoading(false);
    props.close();
  };
  const handleOnBlur = (e) => {
    const value = parseFloat(e.target.value);
    const name = e.target.name;

    const pattern = /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/;
    if (pattern.test(value)) {
      const money = value.toFixed(2);
      setData({
        ...data,
        [name]: money,
      });
    }
  };
  function isYear(birthYear) {
    return currentYear - birthYear;
  }
  const deleteFile = (file) => {
    const newArray = [];
    filesData.forEach((fileInter) => {
      if (fileInter.public_id != file.public_id) {
        newArray.push(fileInter);
      }
    });
    setFilesData(newArray);
  };

  // handle get client axios
  async function getClient(num) {
    const options = {
      method: "GET",
      url: "https://www.apisperu.net/api/dni/" + num,
      headers: {
        Authorization:
          "Bearer c7c81f1bbf1836d1903b37dc6d2feb46d5960fb73824d259040c35f3ba9b5b7b",
        // "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdXN0aW5ubUBnbWFpbC5jb20ifQ.7ogP6TlyZMkl2eT4Ok9HG7sBb06i6M1vctlipW5LH_M"
      },
    };
    const res = await axios.request(options);
    setLoadingRuc(false);
    return res.data;
  }
  const handleRucSearsh = async (e) => {
    const pattern = /^[0-9,$]*$/;

    const dni = e.target.value;
    setData({ ...data, verify: false, dni: e.target.value });
    if (dni.trim().length === 8 && pattern.test(dni)) {
      setLoadingRuc(true);
      try {
        const result = await getClient(dni);
        if (result.success) {
          setData({
            ...data,
            names: result.data.nombres,
            lastName: result.data.apellido_paterno,
            motherLastName: result.data.apellido_materno,
            verify: true,
            dni: dni,
          });
          setValue("names", result.data.nombres);
          setValue("lastName", result.data.apellido_paterno);
          setValue("motherLastName", result.data.apellido_materno);
          clearErrors("names");
          clearErrors("lastName");
          clearErrors("motherLastName");
        } else {
        }
        setLoadingRuc(false);
      } catch (error) {
        setLoadingRuc(false);
        console.log(error);
      }
    }
  };
  const changeYouger = (e) => {
    if (e.target.checked) {
      unregister("attorney");
      clearErrors("attorney");
      clearErrors("year");
    } else {
      register("attorney", { required: true });
      clearErrors("attorney");
      if (isYear(data.year) < 18) {
        setError("year", { type: "custom", message: "Menor de Edad" });
      }
    }
  };

  //useEfects
  useEffect(() => {
    getDataGroupsService(setGroups);
    getDataGeadquartersService(setGeadquarters);
    register("groupUid", { required: true });
    register("geadquarterUid", { required: true });
  }, []);

  useEffect(() => {
    let memberFee = null;
    if (isYear(data.year) < 26) {
      memberFee = "30.00";
      setValue("memberFee", "30.00");
      clearErrors("memberFee");
    } else if (isYear(data.year) > 25) {
      memberFee = "40.00";
      setValue("memberFee", "40.00");
      clearErrors("memberFee");
    }
    setData({
      ...data,
      memberFee: memberFee,
    });
  }, [data.year]);

  useEffect(() => {
    const bookletFee = parseFloat(data.bookletFee);
    const celebrationFee = parseFloat(data.celebrationFee);
    const memberFee = parseFloat(data.memberFee);
    let total = bookletFee + memberFee + celebrationFee;
    if (!total.isNaN) {
      setData({
        ...data,
        totalFee: total.toFixed(2),
      });
    }
  }, [data.bookletFee, data.celebrationFee, , data.memberFee]);

  return (
    <div className="">
      <div className="flex flex-col pb-2">
        <div className="flex items-center">
          <h1 className="mr-auto leading-8 text-2xl font-bold tracking-tight dark:text-neutral-200">
            {props.data ? " Actualizar" : " Registrar"}
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
      <div className="flex items-center gap-1 pb-2">
        <div className="relative flex max-w-max">
          <div className="w-[35px] h-[35px] rounded-full border overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={userData.photoUrl}
              alt=""
            />
          </div>
          <div className="absolute bottom-0 right-1">
            {userData.providerId.split(".")[0] === "facebook" ? (
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
            ) : userData.providerId.split(".")[0] === "google" ? (
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
        <div className=" font-semibold text-sm flex flex-col dark:text-white">
          <span>{userData.name}</span>
          <span className="leading-3 text-xs font-normal dark:text-neutral-400 ">
            {moment().format("LL")}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 w-[400px]">
          <div className="w-full">
            <h3 className="dark:text-zinc-100 text-sm font-semibold pl-1">
              Datos del miembro
            </h3>
          </div>
          <div className="flex gap-1">
            <div className="w-40">
              <TextField
                autoFocus
                // info={<>DNI</>}
                requiredName="Ingrese un Dni"
                patternName={`El dni "${data.dni}" es invalido, se acepta solo numeros`}
                maxLengthName="No puede contener mas de 8 caracteres"
                minLengthName="Debe contener 8 caracteres"
                type="text"
                placeholder="N° Identificiación"
                // long
                checked={data.verify}
                onChange={handleRucSearsh}
                iconLoadingLeft={loadingRuc}
                disabled={loadingRuc}
                value={data.dni}
                error={errors.dni}
                control={control}
                name="dni"
                rules={{
                  pattern: /^[0-9,$]*$/,
                  required: true,
                  maxLength: 8,
                  minLength: 8,
                }}
              />
            </div>
            <div className="w-80">
              <TextField
                // info={"Nombres"}
                requiredName="Ingrese los nombres"
                patternName="Solo letras y espacios"
                placeholder="Nombres"
                type="text"
                // long
                onChange={handleChange}
                value={data.names}
                error={errors.names}
                control={control}
                name="names"
                rules={{
                  required: true,
                  pattern:
                    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
                }}
              />
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-full">
              <TextField
                // info={"Apellido Paterno"}
                requiredName="Ingrese el apellido paterno"
                patternName="El apellido solo debe contener letras"
                placeholder="Apellido Paterno"
                type="text"
                // long
                onChange={handleChange}
                value={data.lastName}
                error={errors.lastName}
                control={control}
                name="lastName"
                rules={{
                  required: true,
                  pattern:
                    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
                }}
              />
            </div>
            <div className="w-full">
              <TextField
                // info={"Apellido Materno"}
                requiredName="Ingrese el apellido materno"
                patternName="El apellido solo debe contener letras"
                placeholder="Apellido Materno"
                type="text"
                // long
                onChange={handleChange}
                value={data.motherLastName}
                error={errors.motherLastName}
                control={control}
                name="motherLastName"
                rules={{
                  required: true,
                  pattern:
                    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
                }}
              />
            </div>
            <div className="w-full">
              <TextField
                // info={"Numero de telefono"}
                patternName="Invalido"
                placeholder="Celular (Opcional)"
                type="text"
                // long
                onChange={handleChange}
                value={data.phone}
                error={errors.phone}
                // componentLeft="PE"
                control={control}
                name="phone"
                rules={{
                  pattern: /^[0-9,$]*$/,
                }}
              />
            </div>
          </div>
          <div className=" ">
            <div className="mb-1">
              <span className="dark:text-zinc-400 text-xs">
                Fecha de nacimiento
              </span>
            </div>
            <div className="flex gap-2">
              <div className="w-full">
                <Combobox
                  onChange={handleChange}
                  // long
                  info="Dia"
                  error={errors.day}
                  name="day"
                  control={control}
                >
                  {days.map((item, index) => {
                    return (
                      <option
                        className="font-semibold text-xs"
                        key={index}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
                </Combobox>
              </div>
              <div className="w-full">
                <Combobox
                  onChange={handleChange}
                  // long
                  info="Mes"
                  error={errors.day}
                  name="month"
                  control={control}
                >
                  {monthsDate.map((item, index) => {
                    return (
                      <option
                        className="font-semibold text-xs"
                        key={index}
                        value={index + 1}
                      >
                        {item}
                      </option>
                    );
                  })}
                </Combobox>
              </div>
              <div className="w-full">
                <Combobox
                  onChange={handleChange}
                  minName="Tienes que ser mayor de edad"
                  // long
                  info="Año"
                  value={data.year}
                  error={errors.year}
                  name="year"
                  control={control}
                >
                  {years.map((item, index) => {
                    return (
                      <option
                        className="font-semibold text-xs"
                        key={index}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
                </Combobox>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-full pl-1 py-1">
                <CheckBox
                  text={"Miembro menor de edad"}
                  onChange={(e) => {
                    setData({ ...data, younger: e.target.checked });
                    changeYouger(e);
                  }}
                  checked={data.younger}
                />
              </div>
            </div>
            {data.younger && (
              <div className="py-2 w-full">
                <TextField
                  // info={"Apoderado"}
                  requiredName="Ingrese los nombres del apoderado"
                  patternName="El apellido solo debe contener letras"
                  placeholder="Apoderado"
                  type="text"
                  // long
                  onChange={handleChange}
                  value={data.attorney}
                  error={errors.attorney}
                  control={control}
                  name="attorney"
                  rules={{
                    required: true,
                    pattern:
                      /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g,
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="w-60">
              <h2
                className={`pb-2 ${
                  errors["groupUid"]
                    ? "text-red-500 dark:text-red-500"
                    : "text-neutral-800"
                } pl-1 text-xs dark:text-neutral-100`}
              >
                Selecciona un grupo
              </h2>
              <div
                className={`  bg-[#eef1f3] dark:bg-neutral-800 border dark:border-neutral-600  w-full p-1 rounded-[5px] ${
                  errors["groupUid"]
                    ? "border-red-600 dark:border-red-500"
                    : "border-neutral-300 "
                } `}
              >
                <div className="flex flex-wrap justify-center gap-1 ">
                  {groups &&
                    groups.map((item, index) => (
                      <div
                        onClick={() => {
                          item.statu &&
                            handleChange({
                              target: {
                                name: "groupUid",
                                value: item.uid,
                              },
                            });
                          item.statu && clearErrors("groupUid");
                          item.statu && setValue("groupUid", item.uid);
                        }}
                        tooltip={!item.statu ? "Grupo inactivo" : null}
                        key={index}
                      >
                        <div
                          tabIndex="0"
                          role="button"
                          className={`transition-colors w-[30px] h-[30px] flex items-center justify-center ${
                            !item.statu && "opacity-20 cursor-default"
                          } cursor-pointer    py-2 p-3 rounded-full  ${
                            item.uid === data.groupUid
                              ? "  bg-green-700  text-neutral-50 dark:text-white  hover:bg-green-800"
                              : "hover:bg-[#a5a6a771] dark:text-neutral-100 "
                          }`}
                        >
                          <span className="font-semibold text-xs">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  {groups && groups.length < 1 && (
                    <div className=" text-neutral-600 leading-4 w-full p-1">
                      <img
                        width="101"
                        className="mx-auto h-70 pb-1"
                        src="/assets/no-data.png"
                        alt=""
                      />
                      <span className="text-sm dark:text-neutral-100">
                        Sin grupos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-60">
              <h2
                className={`pb-2 ${
                  errors["geadquarterUid"]
                    ? "text-red-500 dark:text-red-500"
                    : "text-neutral-800"
                } pl-1 text-xs dark:text-neutral-100`}
              >
                Selecciona una sede
              </h2>
              <div
                className={`bg-[#eef1f3] dark:bg-neutral-800 dark:border-neutral-600 border  w-full p-1 rounded-[5px] ${
                  errors["geadquarterUid"]
                    ? "border-red-600 dark:border-red-500"
                    : "border-neutral-300 "
                } `}
              >
                <div className="flex flex-wrap gap-0 ">
                  {geadquarters &&
                    geadquarters.map((item, index) => (
                      <div
                        className="w-full"
                        tooltip={!item.statu ? "Sede inactivo" : null}
                        key={index}
                      >
                        <div
                          onClick={() => {
                            item.statu &&
                              handleChange({
                                target: {
                                  name: "geadquarterUid",
                                  value: item.uid,
                                },
                              });
                            item.statu && clearErrors("geadquarterUid");
                            item.statu && setValue("geadquarterUid", item.uid);
                          }}
                          role="button"
                          tabIndex="0"
                          className={`transition-colors ${
                            !item.statu && "opacity-20 cursor-default"
                          } ${
                            item.uid === data.geadquarterUid &&
                            "bg-green-700  text-zinc-50 hover:bg-green-800"
                          } cursor-pointer  hover:bg-[#a5a6a771] dark:text-zinc-300 p-2 rounded-md`}
                        >
                          <h3 className="text-xs font-semibold dark:text-white">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  {geadquarters && geadquarters.length < 1 && (
                    <div className=" text-neutral-600 leading-4 w-full p-1">
                      <img
                        width="100"
                        // height="80"
                        className="mx-auto pb-1"
                        src="/assets/world.png"
                        alt=""
                      />
                      <span className="text-sm  dark:text-neutral-100">
                        Sin sedes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" my-2">
            <div className="flex gap-2">
              <div className="w-full">
                <TextField
                  info={"Fecha de entrada"}
                  requiredName="Ingrese la fecha de entrada"
                  type="date"
                  long
                  onChange={handleChange}
                  value={data.entryDate}
                  error={errors.entryDate}
                  control={control}
                  name="entryDate"
                  rules={
                    {
                      // required: true,
                    }
                  }
                />
              </div>
              <div className="w-full">
                <TextField
                  info={"Fecha de baja"}
                  requiredName="Ingrese la fecha de baja"
                  type="date"
                  long
                  onChange={handleChange}
                  value={data.dischargeDate}
                  error={errors.dischargeDate}
                  control={control}
                  name="dischargeDate"
                  rules={
                    {
                      // required: true,
                    }
                  }
                />
              </div>
            </div>
          </div>
          <div className=" gap-2 ">
            <div className="w-full">
              <h3 className="dark:text-zinc-100 text-sm font-semibold pl-1">
                Gestión de cuotas y pagos
              </h3>
            </div>
            <div>
              <div className="flex gap-2">
                <div className="w-full">
                  <TextField
                    info={"Cuota miembro"}
                    requiredName="La cuota es obligatorio"
                    minName={`La cuota minima es S/${
                      isYear(data.year) < 26 ? 30.0 : 40.0
                    }`}
                    patternName="Solo numeros"
                    placeholder="0.00"
                    componentLeft="S/"
                    type="text"
                    // long
                    onChange={handleChange}
                    onBlur={handleOnBlur}
                    value={data.memberFee}
                    error={errors.memberFee}
                    control={control}
                    name="memberFee"
                    rules={{
                      required: true,
                      min: 1,
                      pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
                    }}
                  />
                </div>
                <div className="w-full">
                  <TextField
                    info={"Cuota Librito"}
                    requiredName="La cuota es obligatorio"
                    minName="La cuota minima es S/ 2.00"
                    patternName="Solo numeros"
                    placeholder="0.00"
                    componentLeft="S/"
                    type="text"
                    // long
                    onBlur={handleOnBlur}
                    onChange={handleChange}
                    value={data.bookletFee}
                    error={errors.bookletFee}
                    control={control}
                    name="bookletFee"
                    rules={{
                      required: true,
                      min: 1,
                      pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
                    }}
                  />
                </div>
                <div className="w-full">
                  <TextField
                    info={"Cuota Celebración"}
                    requiredName="La cuota es obligatorio"
                    minName="La cuota minima es S/3.00"
                    patternName="Solo numeros"
                    placeholder="0.00"
                    type="text"
                    componentLeft="S/"
                    // long
                    onBlur={handleOnBlur}
                    onChange={handleChange}
                    value={data.celebrationFee}
                    error={errors.celebrationFee}
                    control={control}
                    name="celebrationFee"
                    rules={{
                      min: 1,
                      required: true,
                      pattern: /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mb-2 dark:text-white pt-2">
            <span className="dark:text-zinc-400 text-xs">Cuota mensual</span>
            <span className="font-semibold text-sm">
              S/ {!data.totalFee.isNaN && data.totalFee}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-sm font-semibold">Fotos adicionales</h2>
          <div className="flex flex-col gap-2">
            {filesData && (
              <div className="flex flex-wrap gap-1">
                {filesData &&
                  filesData.map((file) => (
                    <ItemImage className="cursor-zoom-in hover:scale-110 transition-transform">
                      <div className="relative w-[70px] h-[70px] overflow-hidden rounded-md">
                        <div
                          onClick={() => setFilePreview(file)}
                          className="w-full h-full"
                        >
                          <ImageCustomMeta
                            custom
                            public_id={file.public_id}
                            width={90}
                            title={file.description}
                            altName={file.description}
                          />
                        </div>
                        <div className=" absolute top-2 right-2 opacity-0 btn-image">
                          <EclipseButton
                            onClick={() => {
                              setFilePreview(null);
                              deleteFile(file);
                            }}
                            type="default"
                            size="small"
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
                    </ItemImage>
                  ))}
              </div>
            )}
            <PhotoForm setFiles={setFiles} />
          </div>
          <div className=" gap-2 mt-3">
            <div>
              <div className="flex gap-2">
                <div className="w-full">
                  <TextField
                    multiple
                    info={"Observaciones"}
                    requiredName="La cuota es obligatorio"
                    placeholder="(Opcional)"
                    type="text"
                    onChange={handleChange}
                    value={data.observations}
                    error={errors.observations}
                    control={control}
                    name="observations"
                    rules={{}}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-full pl-2 py-1">
              <CheckBox
                text={data.statu ? "Miembro Activo" : "Miembro Inactivo"}
                onChange={(e) => setData({ ...data, statu: e.target.checked })}
                checked={data.statu}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <PrimaryButton
          disabled={Object.entries(errors).length > 0 ? true : false}
          onClick={handleSubmit(onSubmit)}
          type="primary_transparent"
        >
          {props.data ? "Actualizar" : "Guardar"}
        </PrimaryButton>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,.5)] dark:bg-[rgba(6,7,7,0.5)]">
          <div className="w-full h-full flex items-center justify-center">
            <Rotation width="60px" height="60px" />
          </div>
        </div>
      )}
      {filePreview && (
        <div
          onClick={() => setFilePreview(null)}
          className="absolute rounded-md top-0 left-0 h-full w-full bg-[#ffffff]"
        >
          <div className="relative w-auto h-full justify-center flex items-center mx-auto overflow-hidden">
            <ImageCustomMeta
              public_id={filePreview.public_id}
              width={200}
              title={filePreview.description}
              altName={filePreview.description}
              className="h-full"
            />
            <div className="bottom-3 max-w-max w-[80%]  absolute bg-white p-1 rounded-md ">
              <p className="text-center text-sm font-semibold">
                {filePreview.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ItemImage = styled.div`
  &:hover {
    .btn-image {
      opacity: 1;
    }
  }
`;
