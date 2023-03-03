import React from "react";
import styled from "styled-components";

export default function Rotation(props) {
  return (
    <Container widthBorder={props.borderWidth} colorBorder={props.color}>
      <span
        style={{
          width: props.width ? props.width : "18px",
          height: props.height ? props.height : "18px",
        }}
        className="loader"
      ></span>
    </Container>
  );
}

const Container = styled.div`
  .loader {
    width: 18px;
    height: 18px;
    border-color: ${(props) =>
      props.colorBorder ? props.colorBorder : "#6e6e6e"};
    border-width: ${(props) => (props.widthBorder ? props.widthBorder : "2px")};
    border-style: solid;
    border-bottom-color: transparent;
    border-radius: 50%;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    display: flex;
    align-items: center;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
