import { useEffect, useState } from "react";
import styled from "styled-components";

import { Link, useLocation } from "react-router-dom";
import SckeletonLoader from "../../Loader/SckeletonLoader";

export const AsideButton = (props) => {
  const { pathname } = useLocation();

  const [active, setActive] = useState();

  const Container = ({ children }) => {
    if (props.to) {
      return <Link to={props.to}>{children}</Link>;
    } else {
      return <>{children}</>;
    }
  };

  useEffect(() => {
    if (props.to) {
      if (pathname.split("/")[1] === props.to.split("/")[1]) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [pathname]);

  return (
    <>
      <AsideLink className="w-full blo outline-none h-auto">
        <Container>
          <ButtonContainer>
            <div
              className={`btn_aside flex items-center hover:bg-zinc-100  p-1 rounded-lg ${
                props.iconStroke ? "stroke" : ""
              } ${
                active
                  ? !props.loading
                    ? "active bg-[#72ffb836] "
                    : ""
                  : ""
              } ${props.icon ? "icon" : ""} ${
                props.iconStroke ? "iconStroke" : ""
              } `}
              onKeyPress={
                !props.disabled && !props.loading ? props.onClick : null
              }
              onClick={!props.disabled && !props.loading ? props.onClick : null}
              tooltip={props.title}
              disabled={props.disabled && true}
              role={!props.to ? "button" : null}
              tabIndex={!props.to ? "0" : null}
            >
              {props.loading ? (
                <div className="w-[35px] h-[35px]  rounded-full overflow-hidden">
                  <SckeletonLoader />
                </div>
              ) : (
                <>
                  {props.iconStroke && (
                    <div className={`w-[35px] h-[35px] ${active ? "bg-green-700 " : "bg-zinc-200 dark:bg-zinc-800"}  rounded-full p-[5px]`}>
                      <Icon className="p-0">
                        {props.iconStroke ? props.iconStroke : props.icon}
                      </Icon>
                    </div>
                  )}
                  {props.icon && (
                    <div className={`w-[35px] h-[35px] ${active ? "bg-green-700 text-white " : "bg-zinc-200 "}  rounded-full p-[5px]`}>
                      <Icon className="p-0">
                        {props.iconStroke ? props.iconStroke : props.icon}
                      </Icon>
                    </div>
                  )}
                </>
              )}

              <div className={`pl-2 ${!props.icon ? "py-1" : ""}`}>
                <div
                  className={`${
                    active
                      ? "text-green-700 "
                      : "text-black "
                  }  font-semibold text-sm`}
                >
                  {props.loading ? (
                    <div className=" h-[17px] w-[200px] overflow-hidden rounded-md">
                      <SckeletonLoader />
                    </div>
                  ) : (
                    props.Text
                  )}
                </div>
              </div>
            </div>
          </ButtonContainer>
        </Container>
      </AsideLink>
    </>
  );
};

const AsideLink = styled.div`
  a {
    text-decoration: none;
  }
`;
const ButtonContainer = styled.div`
  .active {
    &.iconStroke {
      svg {
        fill: none !important;
        path {
          stroke-width: 1.5;
          stroke: #fff;
        }
      }
    }
    &.icon {
      svg {
        path {
          fill: currentColor;
          stroke: none;
        }
      }
    }
  }
  .iconStroke {
    svg {
      fill: none !important;
      path {
        stroke-width: 1.5;
        stroke: #888888;
      }
    }
  }
  .icon {
    svg {
      path {
        fill: #949494;
        stroke: none;
      }
    }
  }
`;
const Icon = styled.div`
  width: 100%;
  svg {
    margin: 0 auto;
  }
`;
