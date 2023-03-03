import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PrimaryButton from "../../components/Button/PrimaryButton";
import TextField from "../../components/Form/TextField";
import { useAuth } from "../../context/authContext";

import ReCAPTCHA from "react-google-recaptcha";
import { saveUser } from "../../services/user/userServices";
import { FormatDate } from "../../helpers/moment";

export default function SignUp() {
  const { signUp, signInGoogle, signInFacebook } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const captcha = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    names: "",
    email: "",
    password: "",
    password2: "",
    captcha: false,
  });
  const {
    handleSubmit,
    control,
    setError,
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
    setErrorCode(null);
  };

  const onsubmit = async () => {
    setLoading(true);
    if (data.password != data.password2) {
      setError("password2", {
        type: "custom",
        message: "Las contraseñas no coinciden",
      });
      setLoading(false);

      return;
    }
    try {
      const { user } = await signUp(data);
      const newUser = {
        email: user.email,
        name: data.names,
        role: null,
        statu: true,
        photoUrl:
          "https://scontent.flim9-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c15.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=12b3be&_nc_ohc=CfWz3279CK8AX8TNg1B&_nc_ht=scontent.flim9-1.fna&edm=AHgPADgEAAAA&oh=00_AfAPMwFlEFpQjM1JN9ggR7TJhclTWQJJoV2-s_c858nfTQ&oe=6428D799",
        providerId: user.providerData[0].providerId,
        created_at: FormatDate(),
      };
      await saveUser(newUser, user.uid);
      navigate("/");
    } catch (error) {
      const code = error.code;
      switch (code) {
        case "auth/email-already-in-use": {
          setErrorCode({
            message: `El correo "${data.email}" ya esta en uso, intente nuevamente mas tarde`,
          });
        }
      }
    }
    setLoading(false);
  };

  async function SignInGoogle() {
    setLoadingGoogle(true);
    try {
      await signInGoogle();
      setLoadingGoogle(false);
      // document.location.href = "/";
    } catch (error) {
      console.log(error);
      setLoadingGoogle(false);
    }
  }

  async function SignInFacebook() {
    setLoadingFacebook(true);
    try {
      await signInFacebook();
      setLoadingFacebook(false);
      // document.location.href = "/";
    } catch (error) {
      console.log(error);
      setLoadingFacebook(false);
    }
  }

  function onChange(value) {
    if (captcha.current.getValue()) {
      setData({
        ...data,
        captcha: true,
      });
    }
  }

  return (
    <Content className=" bg-[#fafafa] min-h-[100vh] items-center w-full flex justify-center">
      <div>
        <div className="flex justify-center w-full">
          <Container className=" w-[350px] bg-white :bg-transparent  p-3 flex flex-col gap-2 rounded-lg border">
            <div className="px-1">
              <h1 className="text-3xl font-bold tracking-tighter">Sign Up</h1>
              <span className="flex text-sm mt-1 text-zinc-500">
                Al crear una cuenta este estara inactivo hasta que un
                administrador apruebe tu acceso al sistema
              </span>
            </div>
            {errorCode && (
              <div className="p-2 bg-red-100 text-red-800 font-semibold rounded-md border border-red-400 text-sm">
                {errorCode.message}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <TextField
                  // info="Ingrese su correo electronico"
                  requiredName="Ingrese sus nombres"
                  patternName="Ingrese sus nombres"
                  placeholder="Nombres"
                  type="text"
                  long
                  onChange={handleChange}
                  value={data.names}
                  error={errors.names}
                  control={control}
                  name="names"
                  rules={{
                    required: true,
                  }}
                />
              </div>
              <div>
                <TextField
                  // info="Ingrese su correo electronico"
                  requiredName="Ingrese su correo electronico"
                  patternName={`El correo "${data.email}" es invalido`}
                  placeholder="Correo"
                  type="text"
                  long
                  onChange={handleChange}
                  value={data.email}
                  error={errors.email}
                  control={control}
                  name="email"
                  rules={{
                    required: true,
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  }}
                />
              </div>
              <div>
                <TextField
                  // info="Contraseña"
                  requiredName="Ingresa una contraseña"
                  minLengthName="La contraseña debe contener mas de 6 caracteres"
                  type="password"
                  placeholder="Contraseña"
                  long
                  onChange={handleChange}
                  value={data.password}
                  error={errors.password}
                  control={control}
                  name="password"
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                />
              </div>
              <div>
                <TextField
                  // info="Contraseña"
                  requiredName="Vuelva a escribir la contraseña"
                  minLengthName="La contraseña debe contener mas de 6 caracteres"
                  type="password"
                  placeholder="Vuelva a escribir la contraseña"
                  long
                  onChange={handleChange}
                  value={data.password2}
                  error={errors.password2}
                  control={control}
                  name="password2"
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                />
              </div>
            </div>
            <ReCAPTCHA
              ref={captcha}
              style={{
                margin: "0 auto",
              }}
              sitekey={import.meta.env.VITE_GOOGLE_RECATPCHA_API_KEY}
              onChange={onChange}
            />
            {/* <div className="text-sm pl-1 text-center">Acepta el captcha</div> */}
            <div>
              <PrimaryButton
                to="/create-account-in-acropolis"
                type="primary_transparent"
                loading={loading}
                disabled={
                  Object.entries(errors).length > 0
                    ? true
                    : !data.captcha
                    ? true
                    : false
                }
                onClick={handleSubmit(onsubmit)}
              >
                Crear cuenta
              </PrimaryButton>
            </div>
            {/* <div className="flex items-center justify-center py-1">
              <span className="text-xs font-normal text-zinc-500">
                O tambien
              </span>
            </div> */}
            <div>
              <PrimaryButton
                loading={loadingGoogle}
                onClick={SignInGoogle}
                type="default"
              >
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
                Google
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton
                loading={loadingFacebook}
                onClick={SignInFacebook}
                type="default"
              >
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
                Facebook
              </PrimaryButton>
            </div>
            <div className="text-sm gap-1 items-center flex">
              ¿Ya tienes un cuenta?
              <Link to="/" className="text-blue-500 font-semibold">
                Inicia sesión aquí
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </Content>
  );
}
const Content = styled.div`
  &::before {
    content: "";
    top: 30%;
    left: 20%;
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    filter: blur(150px);
    background-color: #09758637;
  }
`;

const Container = styled.div`
  @media (max-width: 645px) {
    background-color: transparent;
    border: 0;
    padding: 0;
  }
`;
