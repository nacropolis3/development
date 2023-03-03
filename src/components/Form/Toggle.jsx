import styled from "styled-components";

export const ToggleInput = (props) => {
  return (
    <div tooltip={props.tooltip ? props.tooltip : null}>
      <label tabIndex="0" role="button" htmlFor={props.label}>
        <ContainerToggle
          disabled={props.disabled}
          className={props.label ? "long " + props.className : props.className}
        >
          {props.label && (
            <div className="label">
              <span>{props.label}</span>
              {props.span && <small>{props.span}</small>}
            </div>
          )}

          <div className="button r" id="button-1">
            <input
              checked={props.checked}
              type="checkbox"
              id={props.label}
              disabled={props.disabled}
              className="checkbox"
              onChange={props.onChange}
              name={props.name}
            />
            <div className="knobs"></div>
            <div className="layer"></div>
          </div>
        </ContainerToggle>
      </label>
    </div>
  );
};

const ContainerToggle = styled.div`
  position: relative;
  display: flex;
  width: min-content;
  align-items: center;
  margin: 0 auto;
  &.long {
    padding: 7px 10px;
    border-radius: 7px;
    cursor: pointer;
    span {
      color: #000;
      font-weight: 500;
    }
    .button {
      margin-left: auto;
    }
    &:hover {
      background-color: #ccc;
    }
  }
  .label {
    display: flex;
    width: min-content;
    flex-direction: column;
    span {
      color: var(--write-100);
    }
    small {
      color: var(--write-500);
    }
  }
  .knobs,
  .layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .button {
    position: relative;
    width: 35px;
    min-width: 35px;
    height: 24px;
    overflow: hidden;
  }

  .button.r,
  .button.r .layer {
    border-radius: 100px;
  }

  .button.b2 {
    border-radius: 2px;
  }

  .checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  .knobs {
    z-index: 2;
  }

  .layer {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: 1px solid #a5a5a5;
    transition: 0.3s ease all;
    z-index: 1;
  }
  /* Button 1 */
  #button-1 .knobs:before {
    content: "";
    position: absolute;
    opacity: 1 !important;
    top: 50%;
    left: 3px;
    transform: translateY(-50%);
    min-width: 20px;
    min-height: 20px;
    background-color: ${(props) => (props.disabled ? "#fffefe" : "#494949")};
    border-radius: 50%;
    transition: 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15) all;
  }

  #button-1 .checkbox:checked + .knobs:before {
    content: "";
    opacity: 1 !important;
    left: 12px;
    background-color: ${(props) => (props.disabled ? "#6b6b6b" : "#e49d18")};
  }

  #button-1 .checkbox:checked ~ .layer {
    background-color: transparent;
    border: 1px solid #e49d18;
  }

  #button-1 .knobs,
  #button-1 .knobs:before,
  #button-1 .layer {
    transition: 0.3s ease all;
  }
`;
