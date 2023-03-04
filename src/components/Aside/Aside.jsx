import styled from "styled-components";
import { useUser } from "../../context/userContext";
import { AsideButton } from "./components/AsideButton";

export default function Aside() {
  const { userData, loadingUserData } = useUser();
  return (
    <>
      <AsideContainer>
        <AsideList className="flex flex-col gap-1">
          <AsideButton
            to="/"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.4"
                    d="M10.0693 2.8201L3.13929 8.37009C2.35929 8.99009 1.85929 10.3001 2.02929 11.2801L3.35929 19.2401C3.59929 20.6601 4.95928 21.8101 6.39928 21.8101H17.5993C19.0293 21.8101 20.3993 20.6501 20.6393 19.2401L21.9693 11.2801C22.1293 10.3001 21.6293 8.99009 20.8593 8.37009L13.9293 2.83008C12.8593 1.97008 11.1293 1.9701 10.0693 2.8201Z"
                  ></path>
                  <path d="M12 15.5C13.3807 15.5 14.5 14.3807 14.5 13C14.5 11.6193 13.3807 10.5 12 10.5C10.6193 10.5 9.5 11.6193 9.5 13C9.5 14.3807 10.6193 15.5 12 15.5Z"></path>
                </g>
              </svg>
            }
            Text="Inicio"
          />
          <AsideButton
            to="/members"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.4"
                    d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z"
                  ></path>
                  <path d="M14.0809 14.1499C11.2909 12.2899 6.74094 12.2899 3.93094 14.1499C2.66094 14.9999 1.96094 16.1499 1.96094 17.3799C1.96094 18.6099 2.66094 19.7499 3.92094 20.5899C5.32094 21.5299 7.16094 21.9999 9.00094 21.9999C10.8409 21.9999 12.6809 21.5299 14.0809 20.5899C15.3409 19.7399 16.0409 18.5999 16.0409 17.3599C16.0309 16.1299 15.3409 14.9899 14.0809 14.1499Z"></path>
                  <path
                    opacity="0.4"
                    d="M19.9894 7.3401C20.1494 9.2801 18.7694 10.9801 16.8594 11.2101C16.8494 11.2101 16.8494 11.2101 16.8394 11.2101H16.8094C16.7494 11.2101 16.6894 11.2101 16.6394 11.2301C15.6694 11.2801 14.7794 10.9701 14.1094 10.4001C15.1394 9.4801 15.7294 8.1001 15.6094 6.6001C15.5394 5.7901 15.2594 5.0501 14.8394 4.4201C15.2194 4.2301 15.6594 4.1101 16.1094 4.0701C18.0694 3.9001 19.8194 5.3601 19.9894 7.3401Z"
                  ></path>
                  <path d="M21.9902 16.5899C21.9102 17.5599 21.2902 18.3999 20.2502 18.9699C19.2502 19.5199 17.9902 19.7799 16.7402 19.7499C17.4602 19.0999 17.8802 18.2899 17.9602 17.4299C18.0602 16.1899 17.4702 14.9999 16.2902 14.0499C15.6202 13.5199 14.8402 13.0999 13.9902 12.7899C16.2002 12.1499 18.9802 12.5799 20.6902 13.9599C21.6102 14.6999 22.0802 15.6299 21.9902 16.5899Z"></path>
                </g>
              </svg>
            }
            Text="Miembros"
          />
          
          <AsideButton
            to="/payments"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.4"
                    d="M22 9V16.46C22 18.75 20.14 20.6 17.85 20.6H6.15C3.86 20.6 2 18.75 2 16.46V9H22Z"
                  ></path>
                  <path d="M22 7.5399V8.9999H2V7.5399C2 5.2499 3.86 3.3999 6.15 3.3999H17.85C20.14 3.3999 22 5.2499 22 7.5399Z"></path>
                  <path d="M8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25Z"></path>
                  <path d="M14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z"></path>
                </g>
              </svg>
            }
            Text="Pagos"
          />
          {/* <AsideButton
            to="/bills"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.4"
                    d="M16.2391 3.6499H7.75906C5.28906 3.6499 3.28906 5.6599 3.28906 8.1199V17.5299C3.28906 19.9899 5.29906 21.9999 7.75906 21.9999H16.2291C18.6991 21.9999 20.6991 19.9899 20.6991 17.5299V8.1199C20.7091 5.6499 18.6991 3.6499 16.2391 3.6499Z"
                  ></path>
                  <path d="M14.3498 2H9.64977C8.60977 2 7.75977 2.84 7.75977 3.88V4.82C7.75977 5.86 8.59977 6.7 9.63977 6.7H14.3498C15.3898 6.7 16.2298 5.86 16.2298 4.82V3.88C16.2398 2.84 15.3898 2 14.3498 2Z"></path>
                  <path d="M15 12.9502H8C7.59 12.9502 7.25 12.6102 7.25 12.2002C7.25 11.7902 7.59 11.4502 8 11.4502H15C15.41 11.4502 15.75 11.7902 15.75 12.2002C15.75 12.6102 15.41 12.9502 15 12.9502Z"></path>
                  <path d="M12.38 16.9502H8C7.59 16.9502 7.25 16.6102 7.25 16.2002C7.25 15.7902 7.59 15.4502 8 15.4502H12.38C12.79 15.4502 13.13 15.7902 13.13 16.2002C13.13 16.6102 12.79 16.9502 12.38 16.9502Z"></path>
                </g>
              </svg>
            }
            Text="Facturas"
          /> */}
          {/* <AsideButton
            to="/report"
            icon={
              <svg width="27" viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path d="M22 22H2C1.59 22 1.25 21.66 1.25 21.25C1.25 20.84 1.59 20.5 2 20.5H22C22.41 20.5 22.75 20.84 22.75 21.25C22.75 21.66 22.41 22 22 22Z"></path>{" "}
                  <path d="M9.75 4V22H14.25V4C14.25 2.9 13.8 2 12.45 2H11.55C10.2 2 9.75 2.9 9.75 4Z"></path>{" "}
                  <path
                    opacity="0.4"
                    d="M3 10V22H7V10C7 8.9 6.6 8 5.4 8H4.6C3.4 8 3 8.9 3 10Z"
                  ></path>
                  <path
                    opacity="0.4"
                    d="M17 15V22H21V15C21 13.9 20.6 13 19.4 13H18.6C17.4 13 17 13.9 17 15Z"
                  ></path>
                </g>
              </svg>
            }
            Text="Reporte de pagos"
          /> */}
          <AsideButton
            to="/users"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.4"
                    d="M22 7.81V16.19C22 19 20.71 20.93 18.44 21.66C17.78 21.89 17.02 22 16.19 22H7.81C6.98 22 6.22 21.89 5.56 21.66C3.29 20.93 2 19 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z"
                  ></path>
                  <path d="M18.4406 21.66C17.7806 21.89 17.0206 22 16.1906 22H7.81055C6.98055 22 6.22055 21.89 5.56055 21.66C5.91055 19.02 8.67055 16.97 12.0005 16.97C15.3305 16.97 18.0906 19.02 18.4406 21.66Z"></path>
                  <path d="M15.5799 11.58C15.5799 13.56 13.9799 15.17 11.9999 15.17C10.0199 15.17 8.41992 13.56 8.41992 11.58C8.41992 9.60002 10.0199 8 11.9999 8C13.9799 8 15.5799 9.60002 15.5799 11.58Z"></path>
                </g>
              </svg>
            }
            Text="Usuarios"
          />
          <AsideButton
            to="/activities"
            iconStroke={
              <svg viewBox="0 0 25 25" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"></path>
                  <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"></path>
                </g>
              </svg>
            }
            Text="Actividades"
          />
          <LiSeparation className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700"/>
          <h2>Accesos confidencial</h2>
          <AsideButton
            to="/data"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path d="M7.24 2H5.34C3.15 2 2 3.15 2 5.33V7.23C2 9.41 3.15 10.56 5.33 10.56H7.23C9.41 10.56 10.56 9.41 10.56 7.23V5.33C10.57 3.15 9.42 2 7.24 2Z"></path>
                  <path
                    opacity="0.4"
                    d="M18.6695 2H16.7695C14.5895 2 13.4395 3.15 13.4395 5.33V7.23C13.4395 9.41 14.5895 10.56 16.7695 10.56H18.6695C20.8495 10.56 21.9995 9.41 21.9995 7.23V5.33C21.9995 3.15 20.8495 2 18.6695 2Z"
                  ></path>
                  <path d="M18.6695 13.4302H16.7695C14.5895 13.4302 13.4395 14.5802 13.4395 16.7602V18.6602C13.4395 20.8402 14.5895 21.9902 16.7695 21.9902H18.6695C20.8495 21.9902 21.9995 20.8402 21.9995 18.6602V16.7602C21.9995 14.5802 20.8495 13.4302 18.6695 13.4302Z"></path>
                  <path
                    opacity="0.4"
                    d="M7.24 13.4302H5.34C3.15 13.4302 2 14.5802 2 16.7602V18.6602C2 20.8502 3.15 22.0002 5.33 22.0002H7.23C9.41 22.0002 10.56 20.8502 10.56 18.6702V16.7702C10.57 14.5802 9.42 13.4302 7.24 13.4302Z"
                  ></path>
                </g>
              </svg>
            }
            Text="Datos"
          />
        </AsideList>
        <AsideFooter className="w-[200px] mx-auto ">
          <div className="text-center">
            <p className="">
              Copyright © 2023 Nueva Acropolis  
              {/* Development by{" "}
              <a
                className="text-blue-500 hover:underline"
                href="https://daustinndev"
                target="_blank"
              >
                daustinndev
              </a> */}
            </p>
          </div>
        </AsideFooter>
      </AsideContainer>
    </>
  );
}

const AsideContainer = styled.div`
  min-width: 100%;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const AsideList = styled.div`
  h2 {
    text-align: left;
    font-size: 14px;
    padding-left: 5px;
    color: #75787a;
    font-weight: 500;
  }
`;
const LiSeparation = styled.div`
 
`;
const AsideFooter = styled.div`
  flex-wrap: wrap;
  font-size: 12px;
  padding: 5px;
  > div {
    color: #444546;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`;
