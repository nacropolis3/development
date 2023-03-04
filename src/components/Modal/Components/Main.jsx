import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

export default function BodyModal({ children }) {

  return <ContainerMain>{children}
  </ContainerMain>;
}
const ContainerMain = styled.div`
  padding: 13px;
  height: 100%;
`;
