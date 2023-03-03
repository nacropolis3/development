import ReactDom from "react-dom";
import styled from "styled-components";

const LoaderFull = (props) => {
  return ReactDom.createPortal(
    <>
      <LoaderFullContainer
        className={`fixed top-0 left-0 w-full ${[
          props.transparent ? "bg-[rgba(255,255,255,.5)]" : "bg-white",
        ]} h-full`}
      >
        <ContentModal
          aria-modal="true"
          role="dialog"
          className="rounded-lg absolute overflow-y-auto "
        >
          {props.children}
        </ContentModal>
      </LoaderFullContainer>
    </>,
    document.getElementById("loader_full")
  );
};

const LoaderFullContainer = styled.div`
  z-index: 200;
`;

const ContentModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  max-height: 100vh;
  height: max-content;
  max-width: 90%;
`;

export default LoaderFull;
