import ReactDom from "react-dom";
import styled from "styled-components";

const PDFContainer = (props) => {
  return ReactDom.createPortal(
    <>
      <ModalContainer className="fixed inset-0 pointer-events-auto w-full h-full">
      {props.children}
    
      </ModalContainer>
    </>,
    document.getElementById("PDFContainer")
  );
};

const ModalContainer = styled.div`
  z-index: 999;
`;

export default PDFContainer;
