import React, { useState } from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import Rotation from "../Loader/Rotation";

export default function Combobox(props) {
  const { field } = useController(props);
  const [visibleText, setVisibleText] = useState(false);

  return (
    <Container required={props.error?.type === "required"}>
      <Labels>
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
        <select
          style={{
            paddingLeft: props.imageUri || (props.componentLeft && "25px"),
            paddingRight: props.iconLoadingLeft && "35px",
          }}
          className={`${
            props.long ? "py-[9px]" : "py-[6px]"
          } px-[10px] bg-[#ffffff] dark:bg-[#4a4a4b] border ${
            props.error?.type
              ? " border-[#DD0000] dark:border-[#DD0000]  required"
              : "border-[#c7c9ca] dark:border-[#4a4a4b]"
          } text-[#1e1e1f] dark:text-[#e8e8eb] cursor-pointer`}
          disabled={props.disabled}
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
          defaultValue={props.defaultValue}

        >
          {props.children}
        </select>
        {props.iconLoadingLeft && (
          <LoadingIcon>
            <Rotation />
          </LoadingIcon>
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
    color: #707070;
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
  select {
    transition: 0.2s;
    width: 100%;
    background: #ffffff;
    border-radius: 5px;
    outline: 0;
    font-size: 12px;
    color: #1e1e1f;
    &:focus {
      border: 1px solid #0a7934 !important;
      box-shadow: inset 0px 0px 0px 3px #05aa3c2c !important;
    }
    &:hover {
      border: 1px solid #888888;
    }
    &.required {
      box-shadow: inset 0px 0px 0px 3px #e9747413;
    }
    &::placeholder {
      color: #7f7f81;
    }
    option {
      /* text-transform: uppercase; */
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
  gap: 15px;
  .labelLeft {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
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
