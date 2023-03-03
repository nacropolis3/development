import React from "react";
import styled from "styled-components";

export default function ContentModal(props) {
  return (
    <StyledModal
      className="bg-[#fff] dark:bg-[#292a2b] border rounded-lg dark:border-neutral-700"
      style={{
        width: props.width ? props.width : "max-content",
      }}
    >
      {props.children}
    </StyledModal>
  );
}
export const StyledModal = styled.div`
`;
