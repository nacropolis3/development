import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Rotation from "../Loader/Rotation";

export default function EclipseButton(props) {
  const { type, disabled, size, onClick, to, icon } = props;

  const Container = ({ children }) => {
    if (to) {
      return <Link to={to}>{children}</Link>;
    } else {
      return <>{children}</>;
    }
  };

  return (
    <ContainerButton>
      <Container>
        <div
          tooltip={props.tooltip ? props.tooltip : null}
          onKeyPress={!disabled && !props.loading ? onClick : null}
          onClick={!disabled && !props.loading ? onClick : null}
          className={`${type === "default" ? "bg-[#e7e7e7] hover:bg-[#dbdbdb] dark:bg-[#474a4d] dark:hover:bg-[#535658]": ""} ${
            disabled || props.loading ? "disable-button" : ""
          } ${size ? size : ""} `}
          role="button"
          tabIndex="0"
        >
          {props.loading ? (
            <Rotation />
          ) : (
            <div className="flex items-center justify-center ">
              {icon && icon}
            </div>
          )}
        </div>
      </Container>
    </ContainerButton>
  );
}

const ContainerButton = styled.div`
  > a,
  div {
    height: 35px;
    width: 35px;
    min-width: 35px;
    max-width: 35px;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 13px;
    transition: 0.2s;
    border-radius: 50%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-decoration: none;
    > div {
      width: 100%;
    }
    svg {
      path {
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }
    &:active {
      /* transform: scale(0.98); */
    }
    &:hover {
      /* background-color: rgba(145, 145, 145, 0.1); */
    }
  }
  a:hover {
    color: #070707 !important;
  }
  .small {
    height: 28px;
    width: 28px;
    min-width: 28px;
    max-width: 28px;
    svg {
      max-width: 50%;
      max-height: 50%;
      /* color: #2e2e2e; */
    }
  }
  .medium {
    height: 34px;
    width: 34px;
    min-width: 34px;
    max-width: 34px;
    svg {
      max-width: 55%;
      max-height: 55%;
    }
  }
  .large {
    height: 40px;
    width: 40px;
    min-width: 40px;
    max-width: 40px;
    svg {
      max-width: 50%;
      max-height: 50%;
      color: #2e2e2e;
    }
  }
  .primary {
    background: #fff0cc;
    border: 1px solid #fce1a2;
    color: #070707;
    &:hover {
      background: #fde8b6;
    }
    svg {
      fill: #ca7c2424;
      path {
        stroke: #ca7d24 !important;
      }
    }
  }
  .default {
    &:hover {
    }
    svg {
      path {
        stroke: #4e4e4e !important;
      }
    }
  }
  .disable-button {
    cursor: default;
    opacity: 0.5;
  }
`;
