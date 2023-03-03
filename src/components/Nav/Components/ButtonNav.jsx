import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Rotation from "../../Loader/Rotation";

export default function ButtonNav(props) {
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
          className={`${type && type} ${
            disabled || props.loading ? "disable-button" : ""
          } ${size ? size : ""} border hover:border-neutral-400`}
          role={!to && "button"}
          tabIndex={!to && "0"}
        >
          {props.loading ? (
            <Rotation />
          ) : (
            <>
              {props.image && (
                <Image className="flex items-center border overflow-hidden justify-center rounded-ful w-[30px] h-[30px]">
                  <img src={props.image} alt="" referrerPolicy="no-referrer" />
                  {/* <img custom width="60" className="object-cover h-full w-full" to={props.public_id} /> */}
                </Image>
              )}
              {icon && icon}
            </>
          )}
        </div>
      </Container>
    </ContainerButton>
  );
}

const ContainerButton = styled.div`
  > a,
  div {
    height: 40px;
    width: 40px;
    min-width: 40px;
    max-width: 40px;
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
    position: relative;
    > div {
      width: 100%;
    }
    svg {
      max-width: 22px;
      max-height: 22px;
    }
    &:active {
      transform: scale(0.98);
    }
  }
  a:hover {
    color: #070707 !important;
  }
  .transparent {
    &:hover {
      background-color: #dddddd;
    }
    .color {
      fill: #e0dfdc;
    }
  }
  .primary {
    background-color: #e2d9c6;
    color: #e0dfdc;
    &:hover {
      background-color: #e9e1cf;
    }
    .color {
      fill: #e0dfdc;
    }
  }
  .default {
    /* background-color: #dfdfdf; */
    /* border: 1px solid #dfdfdf; */
    &:hover {
      /* background-color: #cecece; */
    }
    .color {
      fill: #050505;
    }
  }
  .disable-button {
    cursor: default;
    opacity: 0.5;
  }
  .medium {
    height: 35px;
    width: 35px;
    min-width: 35px;
    max-width: 35px;
  }
`;

const Image = styled.div`

  border-radius: 50%;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;
