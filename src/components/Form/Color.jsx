import React from "react";
import styled from "styled-components";

export default function Color(props) {
  return (
    <ContainerForm
      style={{
        backgroundColor: props.value,
      }}
    >
      <FormInput className="relative">
        <input {...props} onChange={props.onChange} value={props.value} type="color" />
      </FormInput>
    </ContainerForm>
  );
}

const ContainerForm = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 32px;
  width: 32px;
`;
const FormInput = styled.div`
  border-radius: 5px;
  position: relative;
  input {
    height: 30px;
    width: 30px;
    opacity: 0;
    font-size: 0px;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: pointer;
  }
`;
