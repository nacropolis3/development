import React, { useState } from "react";
import styled from "styled-components";
import Rotation from "../Loader/Rotation";

export default function TextFieldSimple(props) {
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
          <label className="labelLeft" htmlFor={props.name + "key"}>
            {props.LabelTopLeft}
          </label>
        )}
        {props.LinkTopRight && (
          <a href={props.LinkTopRight.to} className="labelRigth">
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
          <div className="componentLeft">{props.componentLeft}</div>
        )}
        {props.multiple ? (
          <textarea
            style={{
              paddingLeft: props.imageUri || (props.componentLeft && "35px"),
            }}
            type={visibleText ? "text" : props.type}
            id={props.name + "key"}
            placeholder={props.placeholder}
            min={props.min}
            value={props.value ? props.value : null}
            onChange={(e) => {
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
            className={`${
              props.long ? "py-[8px]" : "py-[5px]"
            } px-[10px] bg-[#ffffff] dark:bg-[#2c2d2e] border ${
              props.error?.type
                ? " border-[#DD0000] required"
                : "border-[#c7c9ca] dark:border-[#4a4a4b]"
            } text-[#1e1e1f] dark:text-[#e8e8eb]`}
            disabled={props.disabled}
            type={visibleText ? "text" : props.type}
            id={props.name + "key"}
            placeholder={props.placeholder}
            name={props.name}
            min={props.min}
            max={props.max}
            onChange={props.onChange}
            value={props.value}
            // defaultValue={props.defaultValue ? props.defaultValue : null}
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
        {props.iconLoadingLeft && (
          <LoadingIcon>
            <Rotation />
          </LoadingIcon>
        )}
      </div>
      {props.info && (
        <div className="pl-1 pt-1">
          <span className="text-xs block text-gray-500">{props.info}</span>
        </div>
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
    background: #ffffff;
    border: ${(props) =>
      props.required ? "1px solid #DD0000 !important" : "1px solid #c7c9ca"};
    
    border-radius: 5px;
    padding-top: -5px;
    outline: 0;
    font-size: 13px;
    font-weight: 500;
    color: #1e1e1f;
    &:focus {
      border: 1px solid #1662f0 !important;
      box-shadow: inset 0px 0px 0px 3px #105ccf2d !important;
    }
    &:hover {
      border: 1px solid #888888;
      box-shadow: inset 0px 0px 0px 3px #cecece2c !important;
    }
    &::placeholder {
      color: #7f7f81;
    }
  }
  textarea {
    padding-top: 5px;
    resize: vertical;
    min-height: 100px;
    max-height: 300px;
  }
`;
const Labels = styled.div`
  display: flex;
  padding: 0 2px;
  align-items: center;
  .labelLeft {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 3px;
    display: block;
    line-height: 19px;
    box-sizing: border-box;
    color: #007185;
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
const ErrorPanel = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5px;
  .icon {
    min-width: 15px;
    transform: rotate(10deg);
    margin-right: 5px;
    width: 15px;
    height: 15px;
    color: #c40000;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  .info_text {
    color: #c40000;
    font-size: 12px;
    font-weight: 500;
  }
`;
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
