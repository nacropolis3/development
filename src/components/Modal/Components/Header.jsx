import React from "react";
import styled from "styled-components";
import EclipseButton from "../../Button/EclipseButton";
export const HeaderModal = ({
  title,

  btnRightTitle,
  btnRightIcon,
  btnRightIconSvg,
  btnRightOnclick,

  btnLeftTitle,
  btnLeftIcon,
  btnLeftIconSvg,
  btnLeftOnclick,
}) => {
  return (
    <Header className="border-b border-b-[#cccccc] dark:border-b-[#464545]">
      {btnLeftOnclick && (
        <EclipseButton
          tooltip={btnLeftTitle}
          onClick={btnLeftOnclick}
          type="default"
          size="medium"
          icon={
            btnLeftIcon ? (
              btnLeftIcon
            ) : (
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 20L7 12L15 4"
                  style={{
                    strokeWidth: "2",
                    stroke: "currentColor",
                  }}
                ></path>
              </svg>
            )
          }
        />
      )}
      <div className="mx-auto font-bold text-xl tracking-tight"> 
        <h1 className=" text-[#050505] dark:text-zinc-300">{title}</h1>
      </div>
      {btnRightOnclick && (
        <EclipseButton
          tooltip={btnRightTitle}
          onClick={(e) => btnRightOnclick(e)}
          type="default"
          size="medium"
          icon={
            btnRightIcon
              ? btnRightIcon
              : !btnRightIconSvg && (
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
                )
          }
        />
      )}
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;
`;
