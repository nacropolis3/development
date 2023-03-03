import React from "react";
import styled from "styled-components";

export default function ShadowRolling() {
  return (
    <Container>
      <span className="w-[5px] h-[5px] loader rounded-full block"></span>
    </Container>
  );
}

const Container = styled.div`
  .loader {
    position: relative;
    left: -100px;
    box-sizing: border-box;
    animation: shadowRolling 2s linear infinite;
  }
  @keyframes shadowRolling {
    0% {
      box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
    }
    12% {
      box-shadow: 100px 0 black, 0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
    }
    25% {
      box-shadow: 110px 0 black, 100px 0 black, 0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0);
    }
    36% {
      box-shadow: 120px 0 black, 110px 0 black, 100px 0 black,
        0px 0 rgba(255, 255, 255, 0);
    }
    50% {
      box-shadow: 130px 0 black, 120px 0 black, 110px 0 black, 100px 0 black;
    }
    62% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 black, 120px 0 black,
        110px 0 black;
    }
    75% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
        130px 0 black, 120px 0 black;
    }
    87% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0), 130px 0 black;
    }
    100% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
    }
  }
`;
