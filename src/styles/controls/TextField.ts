/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  appGrayColor100,
  appGrayColor200,
  appGrayColor300,
  appGrayColor50,
  appGrayColor700,
  basicColorFill200,
  basicColorFill400,
  basicColorFill600,
  primaryColorFill300,
  systemColorStroke,
  white,
} from 'styles/Color';

export const textField = (disabled: boolean, showError: boolean, componentInsertToolpane: boolean) => css`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 70px;
  height: 26px;
  border: 1px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: ${appGrayColor50};

  &:hover {
    background-color: rgba(109, 113, 249, 0.2);
  }

  &:focus-within {
    border-color: ${primaryColorFill300};
  }

  ${disabled &&
  `
    opacity: 0.3;
    background-color: ${basicColorFill200};
    border-color: ${basicColorFill400};
    pointer-events: none;
  `}

  ${showError &&
  `
    background-color: transparent;
    border-color: ${systemColorStroke};
  `}

  ${componentInsertToolpane &&
  `
    width: auto;
    margin: 2px 16px;
    border: 1px solid ${appGrayColor200};
    background-color: ${white};
  `}
`;

export const textFieldInput = css`
  width: 100%;
  height: 100%;
  padding-left: 8px;

  font-size: 12px;
  font-family: inherit;

  border: 0;
  outline: 0;
  background-color: transparent;

  &::placeholder {
    color: ${appGrayColor300};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    margin: 0;
  }
`;

export const textFieldError = css`
  height: 20px;
  margin-top: 4px;
  margin-left: 10px;
  color: ${systemColorStroke};
  font-size: 11px;
  font-weight: 400;
`;

export const textFieldUnitLeft = css`
  color: ${basicColorFill600};
  margin-left: 8px;
`;

export const textFieldUnitRight = css`
  color: ${basicColorFill600};
  margin-right: 8px;
`;

export const small = css`
  width: 64px;
  height: 28px;
  border-radius: 6px;
  background-color: ${appGrayColor100};
`;

export const middle = css`
  width: 136px;
  height: 28px;
  border-radius: 6px;
  background-color: ${appGrayColor100};
`;

export const widgetStyleTextFieldGroupRoot = css`
  display: flex;
  position: relative;
`;

export const widgetStyleTextFieldGroupChildren = css`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:nth-of-type(1) {
    input {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
  }

  &:nth-last-of-type(1) {
    input {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  &:not(:nth-last-of-type(1)) {
    input {
      right: 1px;
    }
  }

  input {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    background: ${appGrayColor100};
    border: unset;
    outline: unset;
    height: 28px;
    font-family: 'Inter';
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    display: flex;
    align-items: center;
    text-align: left;
    padding-left: 8px;
    color: ${appGrayColor700};
    border: 1px solid ${white};

    &:focus-within {
      border: 1px solid ${primaryColorFill300};
    }
  }
`;

export const widgetStyleTextFieldGroupChildrenTag = css`
  display: flex;
  justify-content: center;
  font-family: 'Inter';
  font-weight: 600;
  font-size: 9px;
  line-height: 11px;
  display: flex;
  align-items: center;
  text-align: center;
  height: 20px;
  color: ${appGrayColor300};
`;
