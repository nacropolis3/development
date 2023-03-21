import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

export default function BodyModal({ children }) {
  return <ContainerMain className="">{children}</ContainerMain>;
}
const ContainerMain = styled.div`
  height: 100%;
`;
