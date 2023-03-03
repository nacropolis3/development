import React from "react";
import styled from "styled-components";

export default function SckeletonLoader(props) {
  return <Container className="w-full h-full" bg={props.bg} />;
}

const Container = styled.div`
  animation: skeleton-loading 1s linear infinite alternate;
  @keyframes skeleton-loading {
    0% {
      background-color: hsl(0, 0%, 90.19607843137256%);
    }
    100% {
      background-color: hsla(0, 0%, 94.50980392156862%, 0.404);
    }
  }
`;
