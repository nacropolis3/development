import React, { useState } from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import Rotation from "../Loader/Rotation";

export default function TextField(props) {
  const { field } = useController(props);
  const [visibleText, setVisibleText] = useState(false);

  return (
    <Container required={props.error?.type === "required"}>
      <Labels className="relative flex items-center gap-1">
        {props.alertInfo && (
          <AlertInfo className="pb-1">
            <div>
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path d="M12 9V14"></path>
                  <path d="M12.0001 21.41H5.94005C2.47005 21.41 1.02005 18.93 2.70005 15.9L5.82006 10.28L8.76006 5.00003C10.5401 1.79003 13.4601 1.79003 15.2401 5.00003L18.1801 10.29L21.3001 15.91C22.9801 18.94 21.5201 21.42 18.0601 21.42H12.0001V21.41Z"></path>
                  <path d="M11.9945 17H12.0035"></path>
                </g>
              </svg>
            </div>
            <div className="alertinfo absolute bg-white text-metagoo-amber rounded-md text-xs font-semibold shadow-md border p-1">
              {props.alertInfo}
            </div>
          </AlertInfo>
        )}
        {props.LabelTopLeft && (
          <label
            className="labelLeft text-metagoo-indigo"
            htmlFor={props.name + "key"}
          >
            {props.LabelTopLeft}
          </label>
        )}
        {props.LinkTopRight && (
          <a
            href={props.LinkTopRight.to}
            className=" ml-auto text-[12px] text-metagoo-amber hover:underline font-semibold"
          >
            {props.LinkTopRight.label}
          </a>
        )}
      </Labels>
      <div className="chts_inpt">
        {props.imageUri && (
          <label htmlFor={props.name + "key"}>
            <div className="imgCont">
              <img src={props.imageUri} alt="" />
            </div>
          </label>
        )}
        {props.icon && <Icon>{props.icon}</Icon>}
        {props.componentLeft && (
          <div className="componentLeft dark:text-zinc-300">
            {props.componentLeft}
          </div>
        )}
        {props.multiple ? (
          <textarea
            style={{
              paddingLeft: props.imageUri || (props.componentLeft && "35px"),
              minHeight: props.minHeight ? props.minHeight : "100px",
              borderRadius: props.rounded ? props.rounded : "5px",
              maxHeight: props.maxHeight ? props.maxHeight : "800px",
            }}
            maxLength={props.maxLength && props.maxLength}
            className={`${
              props.long ? "py-[8px]" : "py-[5px]"
            } px-[10px] bg-[#ffffff] dark:bg-transparent border dark:border-neutral-500 ${
              props.error?.type
                ? " border-[#DD0000] dark:border-[#DD0000] required "
                : "border-[#c7c9ca] "
            } text-[#1e1e1f] dark:text-[#e8e8eb] `}
            type={visibleText ? "text" : props.type}
            id={props.name + "key"}
            placeholder={props.placeholder}
            {...field}
            min={props.min}
            value={props.value ? props.value : field.value}
            onChange={(e) => {
              field.onChange(e);
              props.onChange && props.onChange(e);
            }}
          />
        ) : (
          <input
            style={{
              paddingLeft: props.imageUri || (props.componentLeft && "25px"),
              paddingRight: props.iconLoadingLeft && "35px",
              borderRadius: props.rounded ? props.rounded : "5px",
            }}
            autoFocus={props.autoFocus}
            maxLength={props.maxLength && props.maxLength}
            className={`${
              props.long ? "py-[8px]" : "py-[6px]"
            } px-[10px] bg-[#ffffff] dark:bg-transparent border dark:border-neutral-500 dark:text-neutral-50 ${
              props.error?.type
                ? " border-[#DD0000] dark:border-[#f03e3e] required"
                : "border-[#c7c9ca] "
            } text-[#1e1e1f] `}
            // border: ${(props) =>
            //   props.required ? "1px solid #DD0000 !important" : "1px solid #c7c9ca"};
            disabled={props.disabled}
            type={visibleText ? "text" : props.type}
            id={props.name + "key"}
            autoComplete={props.autocomplete ? "on" : "off"}
            placeholder={props.placeholder}
            {...field}
            min={props.min}
            max={props.max}
            value={props.value ? props.value : field.value}
            defaultValue={
              props.defaultValue ? props.defaultValue : field.defaultValue
            }
            onBlur={(e) => {
              field.onBlur(e);
              props.onBlur && props.onBlur(e);
            }}
            onChange={(e) => {
              field.onChange(e);
              props.onChange && props.onChange(e);
            }}
          />
        )}
        {props.type == "password" && (
          <div className="eyedBtn">
            <button onClick={() => setVisibleText(!visibleText)} type="button">
              {!visibleText ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        )}
        {props.iconLoadingLeft ? (
          <LoadingIcon>
            <Rotation />
          </LoadingIcon>
        ) : (
          props.checked && (
            <div className="absolute top-[50%] translate-y-[-50%] right-2 w-5">
              <svg viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M21.5609 10.7386L20.2009 9.15859C19.9409 8.85859 19.7309 8.29859 19.7309 7.89859V6.19859C19.7309 5.13859 18.8609 4.26859 17.8009 4.26859H16.1009C15.7109 4.26859 15.1409 4.05859 14.8409 3.79859L13.2609 2.43859C12.5709 1.84859 11.4409 1.84859 10.7409 2.43859L9.17086 3.80859C8.87086 4.05859 8.30086 4.26859 7.91086 4.26859H6.18086C5.12086 4.26859 4.25086 5.13859 4.25086 6.19859V7.90859C4.25086 8.29859 4.04086 8.85859 3.79086 9.15859L2.44086 10.7486C1.86086 11.4386 1.86086 12.5586 2.44086 13.2486L3.79086 14.8386C4.04086 15.1386 4.25086 15.6986 4.25086 16.0886V17.7986C4.25086 18.8586 5.12086 19.7286 6.18086 19.7286H7.91086C8.30086 19.7286 8.87086 19.9386 9.17086 20.1986L10.7509 21.5586C11.4409 22.1486 12.5709 22.1486 13.2709 21.5586L14.8509 20.1986C15.1509 19.9386 15.7109 19.7286 16.1109 19.7286H17.8109C18.8709 19.7286 19.7409 18.8586 19.7409 17.7986V16.0986C19.7409 15.7086 19.9509 15.1386 20.2109 14.8386L21.5709 13.2586C22.1509 12.5686 22.1509 11.4286 21.5609 10.7386ZM16.1609 10.1086L11.3309 14.9386C11.1909 15.0786 11.0009 15.1586 10.8009 15.1586C10.6009 15.1586 10.4109 15.0786 10.2709 14.9386L7.85086 12.5186C7.56086 12.2286 7.56086 11.7486 7.85086 11.4586C8.14086 11.1686 8.62086 11.1686 8.91086 11.4586L10.8009 13.3486L15.1009 9.04859C15.3909 8.75859 15.8709 8.75859 16.1609 9.04859C16.4509 9.33859 16.4509 9.81859 16.1609 10.1086Z"
                    fill="#097be6"
                  ></path>
                </g>
              </svg>
            </div>
          )
        )}
      </div>
      {props.error ? (
        <ErrorPanel className="pl-1 pt-1">
          <div className="text-xs text-red-700 dark:text-red-500 ">
            {props.error?.type === "custom" && (
              <div>{props.error?.message}</div>
            )}
            {props.error?.type === "min" && <div>{props.minName}</div>}
            {props.error?.type === "max" && <div>{props.maxName}</div>}
            {props.error?.type === "minLength" && (
              <div>{props.minLengthName}</div>
            )}
            {props.error?.type === "required" && (
              <div>{props.requiredName}</div>
            )}
            {props.error?.type === "maxLength" && (
              <div>{props.maxLengthName}</div>
            )}
            {props.error?.type === "pattern" && <div>{props.patternName}</div>}
          </div>
        </ErrorPanel>
      ) : (
        props.info && (
          <div className="pl-1 pt-1">
            <span className="text-xs block text-gray-500 dark:text-zinc-400">
              {props.info}
            </span>
          </div>
        )
      )}
    </Container>
  );
}
const Container = styled.div`
  position: relative;
  .chts_inpt {
    display: flex;
    position: relative;
  }
  .componentLeft {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    max-width: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .eyedBtn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #414141;
    width: 15px;
    height: 15px;
    button {
      display: flex;
      align-items: center;
      svg {
        color: #414141;
        width: 100%;
        height: 100%;
      }
    }
  }
  .imgCont {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  input,
  textarea {
    transition: 0.2s;
    width: 100%;
    /* border-radius: 4px; */
    padding-top: -5px;
    outline: 0;
    font-size: 12px;
    &:focus {
      border: 1px solid #0a7934 !important;
      box-shadow: inset 0px 0px 0px 3px #05aa3c2c !important;
    }
    &:hover {
      border: 1px solid #888888;
      box-shadow: inset 0px 0px 0px 3px rgba(141, 141, 141, 0.089) !important;
    }
    &::placeholder {
      color: #888888;
    }
    &.required {
      box-shadow: inset 0px 0px 0px 3px #e9747413;
    }
  }

  textarea {
    padding-top: 5px;
    resize: vertical;
    max-height: 1000px;
  }
`;
const Labels = styled.div`
  display: flex;
  padding: 0 2px;
  align-items: center;
  .labelLeft {
    font-size: 12px;
    margin-bottom: 3px;
    display: block;
    line-height: 19px;
    box-sizing: border-box;
    font-weight: 500;
  }
  .labelRigth {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
    display: block;
    line-height: 19px;
    box-sizing: border-box;
    color: #0c7dda;
    width: max-content;
    margin-left: auto;
  }
`;
const ErrorPanel = styled.div``;
const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  svg {
    max-width: 30px;
    max-height: 30px;
    fill: #797979;
    width: 17px;
    height: 17px;
  }
`;
const LoadingIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const AlertInfo = styled.div`
  svg {
    width: 15px;
    height: 15px;
    path {
      stroke: #d37203;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
  &:hover {
    .alertinfo {
      display: block;
    }
  }
  .alertinfo {
    z-index: 1;
    bottom: 100%;
    display: none;
  }
`;
