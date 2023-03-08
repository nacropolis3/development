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
      <div
        style={{
          backgroundImage: "url(assets/Bradley+Mountain09.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="h-[100vh] w-[100%] flex items-end "
      >
        <div className="bg-gradient-to-t from-green-800 to-transparent pt-50">
          <div className="w-[50%] banner-text p-10 flex flex-col">
            <h1 className="text-6xl font-bold text-green-50 drop-shadow-lg tracking-tight">
              Imagina todo lo que puedes descubrir en tí.
            </h1>
            <p className="mt-5 drop-shadow-lg text-neutral-200">
              Imagina todo lo que puedes descubrir en ti mismo si te tomas el
              tiempo para explorar tus pensamientos, emociones y acciones, y te
              permites experimentar y crecer sin miedo al fracaso o al juicio de
              los demás.
            </p>

            <a
              className="max-w-min mt-2"
              target="_blank"
              href="https://www.facebook.com/acropolisayacucho"
            >
              <div className="flex items-center min-w-max gap-1 text-white">
                <div className="w-10 h-10">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 12.05C19.9813 10.5255 19.5273 9.03809 18.6915 7.76295C17.8557 6.48781 16.673 5.47804 15.2826 4.85257C13.8921 4.2271 12.3519 4.01198 10.8433 4.23253C9.33473 4.45309 7.92057 5.10013 6.7674 6.09748C5.61422 7.09482 4.77005 8.40092 4.3343 9.86195C3.89856 11.323 3.88938 12.8781 4.30786 14.3442C4.72634 15.8103 5.55504 17.1262 6.69637 18.1371C7.83769 19.148 9.24412 19.8117 10.75 20.05V14.38H8.75001V12.05H10.75V10.28C10.7037 9.86846 10.7483 9.45175 10.8807 9.05931C11.0131 8.66687 11.23 8.30827 11.5161 8.00882C11.8022 7.70936 12.1505 7.47635 12.5365 7.32624C12.9225 7.17612 13.3368 7.11255 13.75 7.14003C14.3498 7.14824 14.9482 7.20173 15.54 7.30003V9.30003H14.54C14.3676 9.27828 14.1924 9.29556 14.0276 9.35059C13.8627 9.40562 13.7123 9.49699 13.5875 9.61795C13.4627 9.73891 13.3667 9.88637 13.3066 10.0494C13.2464 10.2125 13.2237 10.387 13.24 10.56V12.07H15.46L15.1 14.4H13.25V20C15.1399 19.7011 16.8601 18.7347 18.0985 17.2761C19.3369 15.8175 20.0115 13.9634 20 12.05Z"
                      fill="currentColor"
                    ></path>{" "}
                  </svg>
                </div>
                <div>
                  <div className="font-semibold ">
                    Facebook - Nueva Acrópolis
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-center max-w-[420px] px-5">
        <Container className="  mx-auto w-full p-3 flex flex-col gap-2 rounded-lg">
          <div className="py-5 w-full">
            <div className="mx-auto w-32 text-[#0e3838]">
              <svg viewBox="0 0 205.572 81.411">
                <path
                  fill="currentColor"
                  style={{
                    fillRule: "evenodd",
                  }}
                  d="M32.55288696.36358643c5.05255127 1.03012085 10.2494812 4.52774047 13.20883179 8.83990478.52929688.79055786 4.21044922 7.85766602 8.18029785 15.69140625C67.6079712 51.91766357 76.22137451 68.61524963 77.5687256 70.65153503c4.1142273 6.27656556 10.08105468 9.65441895 17.10650634 9.67837525 4.33074952.0239563 7.77130127-.93429566 11.06750489-3.0903778 4.95629882-3.21014405 8.08407592-8.28889466 8.87805175-14.37380982l.19247437-1.67694092.04812622 1.43737793c.09625244 4.19236755 2.21350098 8.28889465 6.32772827 12.24169922 3.10372925 2.97058105 6.37582398 4.79127502 10.65847778 5.86930847l2.64654541.67077637-32.60095214-.0479126-32.60101319-.0479126-2.30975342-.64682007c-5.0284729-1.36550903-8.58932495-3.88093567-11.47650146-8.14515686-1.32330322-1.91651916-8.8540039-16.69758606-19.58465576-38.37809753-5.67810059-11.4271698-11.01937866-21.9919281-11.90960694-23.47721863C20.93200684 5.53814697 17.49145508 2.8550415 11.42840576.9145813L8.66152954.02819824 19.6809082.00424194c9.16677857-.0239563 11.33215332.0479126 12.87197876.35934449zm96.40750122.16769409c5.00445557 1.48529052 10.10510254 5.29434204 12.99230957 9.70233154.55334473.88638306 6.13519288 11.95422363 12.39074707 24.60317993 15.15765381 30.66412354 16.69750977 33.70658875 18.14111329 35.93452454 3.65704345 5.58183288 7.55474853 8.4086914 13.61779785 9.94189453l2.76690674.69473267h-10.706604c-6.2555542.0239563-11.59680177-.0958252-12.87200929-.239563-2.71875-.31143188-6.0149536-1.38946532-8.15625-2.65914916-2.23754882-1.3176117-4.95629882-3.92884827-6.54425048-6.32447815-.72180176-1.0780487-3.4887085-6.3484497-6.11120606-11.69070435l-4.81195068-9.72628784h-25.02215576v-2.63519287h11.78930664c6.49615478 0 11.7892456-.0958252 11.7892456-.1916504 0-.35934447-17.90045166-34.80859374-19.12750244-36.82092284-1.5638733-2.56333924-4.93225098-5.86932373-7.48257446-7.35461426-1.05865479-.62286377-2.9593811-1.48529053-4.21047974-1.9165039-2.14129639-.74264527-2.4300232-.76660157-5.75027466-.76660157-2.57440185 0-3.89767456.0958252-5.05255127.40725708-2.35787964.64682007-6.18338012 2.58728027-7.96380615 4.0725708-3.84954834 3.186203-6.8329773 8.88781738-6.97732544 13.34370423l-.04812622 1.07803344-.21652222-1.31759643c-.6977539-4.09654236-1.70825195-6.70777893-3.65710449-9.438797-1.20297241-1.67695618-3.84954834-4.2642517-5.4375-5.34228516-2.52627563-1.70089721-6.4239502-3.21014404-9.50360107-3.64135742-.84210205-.1197815 12.22235107-.19165039 31.63861084-.16769409 30.94085693.0239563 33.17840576.0479126 34.52575683.45516968zm62.00201416.86242676c-8.324646 1.67695617-10.36975097 1.67695617-18.69439697 0-4.98040771-1.00616456-9.81640625-1.41342164-11.23596191-.95825196-1.17889405.38330078-2.38189698 1.2696991-3.10369873 2.25190735-1.01049805 1.38946533-.8661499 1.50924683.57745361.43121338 1.49169922-1.12594605 2.887146-1.67695618 4.7397461-1.84465027 1.08270263-.1197815 2.21350097.0958252 6.49615478 1.1978302 6.85705566 1.74880982 8.6856079 2.0602417 11.90960693 2.0602417 3.34429932 0 5.53375244-.38330078 12.15020752-2.0602417 6.08709717-1.55717468 6.73669434-1.58113098 9.57574463-.0958252.9383545.47912598 1.7322998.81451417 1.7322998.71868897 0-.47912598-2.4781494-2.34773254-3.48864746-2.63520813-1.6842041-.47912598-5.17285156-.1676941-10.6585083.93429566zM25.67175293 8.12545776c-.60147095-.86242675-1.9729004-2.44355774-3.03152466-3.54554748L20.7154541 2.61547852h4.4510498c4.90820313 0 6.42398072.23956298 9.52767945 1.41343689 3.2480774 1.26968383 6.1352539 3.3299408 8.39685059 6.01304626 1.08270263 1.29364014 2.76687622 4.45587158 9.59985351 18.0870514 11.981781 23.93240356 21.10043335 41.56428527 22.9289856 44.31925964.89019775 1.36550903 2.45410156 3.25805664 3.60894775 4.40797424l2.02102661 2.0123291-4.88412475-.1437378c-5.4375-.14373779-7.74725342-.50308227-10.49005127-1.65298461-3.2480774-1.3176117-6.35180664-3.78511048-8.18032837-6.44425965-.4090271-.57495117-7.5307312-14.54151916-15.83132935-30.99952697C33.53930664 23.14608765 26.2732544 8.98788452 25.67175293 8.12545776zM76.052948 3.52583313c1.75637817 1.26968384 4.04205322 4.14445496 5.269104 6.61195374.07217407.19165039.16842652.19165039.24060059 0 1.22705078-2.46749878 3.60894775-5.3901825 5.53375244-6.75569153l.72177124-.50308228-6.35177612-.0239563h-6.35177613l.93832398.67077637zm128.52731323 7.40249634c-3.32025146 3.2341156-8.37280273 2.61125183-10.8269043-1.31759644-.26464843-.43121338-.69769287-1.41342163-.93829345-2.1560669l-.45715332-1.36550903.09625244 1.50924683c.24060058 3.56950378 2.6465454 6.08491516 6.2555542 6.44425964 2.33380127.239563 4.6194458-.74264526 6.15930175-2.68310546 1.05859375-1.3176117.89019776-1.58113099-.28875732-.43122864zm-34.18896484-3.30596924c-.24060059 2.65914917-1.61199952 4.67149353-3.96984864 5.79743957-.8661499.40725708-1.5639038.55099488-2.93530273.55099488-2.21350098 0-3.77734375-.69473267-5.26904297-2.39562989-1.22705078-1.38948059-1.29925537-1.94047546-.07220459-.76661682.48120117.50309754 1.51574707 1.1738739 2.28570557 1.53321839 1.2029419.52703857 1.66009521.62286377 3.15179443.52703857 1.44360352-.0718689 1.9729004-.21560669 2.93530274-.79055786 1.49169921-.93429565 2.83905029-2.70707703 3.36834716-4.47984314.24060059-.76660156.48120118-1.38946533.52935791-1.38946533.07214356 0 .0480957.62286377-.02410888 1.41342163zm-10.99523926 1.29364014c.7458496.91035461 1.8526001 1.36552429 3.36834717 1.36552429 1.5639038 0 2.550354-.43121338 3.68115234-1.58113098l.9142456-.93429566-.26464843.76660156c-.336792.95826722-1.66009522 2.25190735-2.69470215 2.61125184-2.5984497.95825195-5.36529541-.52703858-6.06304932-3.2580719-.14434814-.55099488-.12030029-.55099488.14434815-.1437378.16845703.239563.57745361.76660157.91430664 1.17385865zm34.06860351 42.33088684c.04815674 0 .09625245-8.36076355.09625245-18.56617737V14.11453247l-11.47650147.0479126c-9.33520508.0239563-10.706604.0718689-7.2901001.21560669 11.50054932.50308227 17.56359864 1.58111572 17.56359864 3.06640625 0 .50308227-.0480957.50308227-12.27044678.50308227h-12.27050781v.83848572c0 .45516968.09625244.83847046.21655273.83847046.1203003 0 .38494873.0718689.60150147.1437378.28869628.09582519.38494873 0 .38494873-.35934449 0-.28747559.09625244-.50308227.21655273-.50308227.1203003 0 .38494873-.0718689.60144043-.1437378.28875732-.1197815.38500977.0239563.38500977.59890747 0 .47912598.168396.81451416.45709228.98220825.6977539.35934449.74584961.31143189.74584961-.59890747 0-.45516967.09625244-.83847045.21655273-.83847045.1203003 0 .38494874-.0718689.60150147-.1437378.31274414-.1197815.38494873.0479126.38494873 1.03012085 0 1.17385864.02404785 1.19781494.9383545 1.46133423.50524902.1676941.98645019.28747559 1.0826416.28747559.07220458 0 .14440917-.59890747.14440917-1.31759644 0-.95825195.09619141-1.31759643.336792-1.31759643.16845703 0 .67370605-.0718689 1.08270263-.1437378l.74584961-.16769409v4.31213379l.96240235.64683533c.52929687.33538818 1.01049804.62286377 1.08270263.62286377.07214356 0 .1203003-1.1259613.1203003-2.49147034 0-1.38946533.07214355-2.56332398.19244384-2.63519287.09625244-.0479126.57745362-.1676941 1.08270264-.26351929l.89019775-.1676941v7.3785553l3.3684082 3.30596925v-5.05477906c0-4.83918762.02404786-5.1027069.48120118-5.3422699.48120117-.26351928.48120117-.19165039.48120117 5.89326478 0 4.95895385.07214355 6.25260925.336792 6.54008483.19250488.2156067.72180175.98220826 1.20300292 1.70089722l.8661499 1.31759644v-7.59416199c0-7.354599.02404786-7.61811829.48120118-7.85768127.48120117-.2635193.48120117-.1916504.48120117 8.69615173v8.95968628l.9864502 2.61123657c.52929687 1.43737793 1.08270263 2.77893066 1.20300292 2.97058105.1203003.21562195.2164917-4.43191528.2164917-11.3073883 0-11.42718506 0-11.69070435.48120117-11.93026733.48120118-.2635193.48120118-.1916504.48120118 13.91864013 0 13.51138306.02404785 14.27798462.50524902 16.29032898.26470947 1.17385864.55340576 2.1321106.60150146 2.1321106zM20.57110596 62.67407227c0 .38330078.21655273 1.53320312.45715332 2.58728027 2.09320068 8.5284729 8.15625 14.11030579 17.05838012 15.6914215l2.57437134.43121339H0l2.57440186-.43121338c4.93225097-.88638306 8.3246765-2.58728028 11.62088012-5.86930847 3.19995117-3.186203 4.9803772-6.70777893 5.7262268-11.25949097.26464845-1.77276611.64959718-2.41958618.64959718-1.14990234zM15.49450684 77.7665863c1.37139892-1.05407714 3.48867797-3.68928527 4.30670166-5.3901825.21655273-.40725707.43307495-.76660155.50524902-.76660155.07217407 0 .62554932.81451416 1.22705078 1.8206787 1.10675049 1.86859132 2.5984497 3.5695038 4.21047974 4.81523133l.96237182.76660156h-6.3036499c-3.48867798 0-6.32772827-.0239563-6.32772827-.0718689 0-.0239563.64962769-.57495117 1.41952515-1.17385864z"
                />
              </svg>
            </div>
          </div>
          <div className="px-1 w-full">
            <h1 className="text-3xl font-bold tracking-tighter">
              Crear Cuenta
            </h1>
            <span className="flex text-sm mt-1 text-zinc-500">
              Al crear una cuenta este estará inactivo hasta que un
              administrador apruebe tu acceso al sistema.
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
          <div className="flex items-center justify-center py-1">
            <span className="text-xs font-normal text-zinc-500">
              O tambien únete con
            </span>
          </div>
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
  @media (max-width: 900px) {
    flex-direction: column;
    .banner-text {
      width: 100%;
    }
  }
`;

const Container = styled.div`
  @media (max-width: 645px) {
    background-color: transparent;
    border: 0;
    padding: 0;
  }
  @media (max-width: 900px) {
    height: 100vh;
  }
`;
