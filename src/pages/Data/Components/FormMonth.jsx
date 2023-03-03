import React from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import TextField from "../../../components/Form/TextField";
import { ColumnGrid, RowGrid } from "../../../components/Grid";
import Rotation from "../../../components/Loader/Rotation";
import CheckBox from "../../../components/Form/CheckBox";
import { useUser } from "../../../context/userContext";
import { FormatDate } from "../../../helpers/moment";
import { useObject } from "../../../hooks/useObject";
import { useToggle } from "../../../hooks/useToggle";
import {
  deleteDataMonthService,
  saveDataMonthService,
  updateDataMonthService,
} from "../../../services/Data/DataServices";

export default function FormMonth(props) {
  const [data, setData] = useObject(
    props.data
      ? props.data
      : {
          name: "",
          statu: true,
          order: 1,
        }
  );
  const { userData } = useUser();
  const [loading, setLoading] = useToggle(false);
  const {
    handleSubmit,
    control,
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
    let newData = {
      ...data,
    };

    if (props.data) {
      delete newData.uid;
      newData = {
        ...newData,
        updated_user: userData.uid,
      };
      await updateDataMonthService(newData, props.data.uid);
    } else {
      newData = {
        ...newData,
        created_at: FormatDate(),
        created_user: userData.uid,
      };
      await saveDataMonthService(newData);
    }
    setLoading(false);
    props.close();
  };

  const handledelete = async () => {
    const confirm = window.confirm("Desea eliminar este dato");
    if (confirm) {
      setLoading(true);
      await deleteDataMonthService(data.uid);
      setLoading(false);

      props.close();
    }
  };
  return (
    <div className=" flex flex-col gap-2 ">
      <div className="flex items-center gap-1">
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
        <div className=" font-semibold text-sm dark:text-white">
          <span>{userData.name}</span>
        </div>
      </div>
      <div>
        <p className="text-sm py-2 flex leading-4 text-zinc-400 dark:text-zinc-300">
          Al finalizar se guardaran automaticamente, la fecha de registro, el
          usuario responsable
        </p>
      </div>
      <RowGrid>
        <ColumnGrid w="8">
          <TextField
            autoFocus
            info="Nombre"
            requiredName="Ingrese un nombre"
            placeholder=""
            type="text"
            long
            onChange={handleChange}
            value={data.name}
            error={errors.name}
            control={control}
            name="name"
            rules={{
              required: true,
            }}
          />
        </ColumnGrid>
        <ColumnGrid w="4">
          <TextField
            info="Orden"
            min="1"
            type="number"
            long
            minName="Invalido"
            requiredName="Obligatorio"
            onChange={handleChange}
            value={data.order}
            error={errors.order}
            control={control}
            name="order"
            rules={{
              min: 1,
              required: true,
            }}
          />
        </ColumnGrid>
      </RowGrid>
      <div className="">
        <TextField
          multiple
          info="Descripcion"
          type="text"
          long
          onChange={handleChange}
          value={data.description}
          error={errors.description}
          control={control}
          name="description"
          rules={{}}
        />
      </div>
      {props.data && (
        <div className="py-1">
          <CheckBox
            text={`${data.statu ? "Activo" : "Inactivo"}`}
            onChange={(e) =>
              setData({
                ...data,
                statu: e.target.checked,
              })
            }
            checked={data.statu}
          />
        </div>
      )}
      <div>
        <PrimaryButton
          disabled={Object.entries(errors).length > 0 ? true : false}
          onClick={handleSubmit(onSubmit)}
          type="primary_transparent"
        >
          {props.data ? "Actualizar" : "Guardar"}
        </PrimaryButton>
      </div>
      {props.data && (
        <div>
          <PrimaryButton onClick={handledelete} type="error">
            Eliminar
          </PrimaryButton>
        </div>
      )}

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
