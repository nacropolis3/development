import styled from "styled-components";

export const ColumnGrid = ({ w, children, styled, className }) => {
  return (
    <>
      <Column style={styled} className={className} w={w}>
        {children}
      </Column>
    </>
  );
};
const Column = styled.div`
  width: ${(props) =>
    props.w === "1" ? "8.333333333333333% !important" : "auto"};
  width: ${(props) =>
    props.w === "2" ? "16.66666666666667% !important" : "auto"};
  width: ${(props) => (props.w === "3" ? "25% !important" : "auto")};
  width: ${(props) =>
    props.w === "4" ? "33.33333333333333% !important" : "auto"};
  width: ${(props) =>
    props.w === "5" ? "41.66666666666667% !important" : "auto"};
  width: ${(props) => (props.w === "6" ? "50% !important" : "auto")};
  width: ${(props) =>
    props.w === "7" ? "58.33333333333334% !important" : "auto"};
  width: ${(props) =>
    props.w === "8" ? "66.66666666666667% !important" : "auto"};
  width: ${(props) => (props.w === "9" ? "75% !important" : "auto")};
  width: ${(props) =>
    props.w === "10" ? "83.33333333333334% !important" : "auto"};
  width: ${(props) =>
    props.w === "11" ? "91.66666666666667% !important" : "auto"};
  width: ${(props) => (props.w === "12" ? "100% !important" : "auto")};
`;
export const RowGrid = ({ w, children, styled, className, spacing }) => {
  return (
    <>
      <Row
        style={{
          ...styled,
          gap: spacing ? spacing : "5px",
        }}
        className={className}
        w={w}
      >
        {children}
      </Row>
    </>
  );
};
const Row = styled.div`
  width: ${(props) => (props.w ? props.w : "auto")};
  display: flex;
  flex-direction: row;
  position: relative;
`;
export const ColumnRowGrid = ({ children, spacing }) => {
  return <ColumnRowGridConta style={{
    display: "flex",
    flexDirection: "column",
    gap: spacing ? spacing : "2px"
  }}>{children}</ColumnRowGridConta>;
};
const ColumnRowGridConta = styled.div`
  width: ${(props) => (props.w ? props.w : "auto")};
  display: flex;
  flex-direction: row;
  position: relative;
`;
