import React from "react";
import styled from "styled-components";

export default function ContentModal(props) {
  return (
    <StyledModal
      className=""
      style={{
        width: props.width ? props.width : "max-content",
      }}
    >
      {props.children}
    </StyledModal>
  );
}
export const StyledModal = styled.div`
  @media (max-width: 700px) {
    height: 100vh;
    width: 100% !important;
  }
`;
