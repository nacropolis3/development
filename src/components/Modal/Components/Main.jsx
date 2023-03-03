import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { disableScroll } from "../../../helpers/Scroll";

export default function BodyModal({ children }) {

  return <ContainerMain>{children}
  </ContainerMain>;
}
const ContainerMain = styled.div`
  padding: 13px;
  
`;
