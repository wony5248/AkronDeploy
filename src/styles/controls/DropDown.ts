/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  primaryColorFill300,
  basicColorFill200,
  basicColorFill400,
  basicColorFillWhite,
  basicColorStroke700,
  basicColorStrokeWhite,
} from 'styles/Color';
import { rightToolpaneDropdownListFontSizes } from 'styles/Size';

export const dropdown = (disabled: boolean) => css`
  position: relative;
  width: 128px;
  height: 28px;
  font-size: 12px;
  box-sizing: border-box;
  user-select: none;

  &:focus-within {
    border: 1px solid ${primaryColorFill300};
    border-radius: 6px;
  }

  ${disabled &&
  `
    opacity: 0.3;
    pointer-events: none;
  `}
`;

export const dropdownContent = (disabled: boolean) => css`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: ${basicColorFillWhite};
  user-select: none;

  ${disabled &&
  `
    background-color: ${basicColorFill200};
    border: 1px solid ${basicColorFill400};
  `}
`;

export const dropdownValue = css`
  box-sizing: border-box;
  text-align: left;
  width: 100%;
  height: 100%;
  padding-left: 6px;
  font-size: ${rightToolpaneDropdownListFontSizes};
  font-family: inherit;
  border: 0;
  outline: 0;
  background-color: transparent;
`;

export const dropdownButtonGroup = css`
  width: 16px;
  height: 100%;
`;

export const dropdownButton = (disabled: boolean) => css`
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-left: 1px solid ${basicColorStrokeWhite};
  background-color: ${basicColorFillWhite};

  &:hover {
    background-color: ${primaryColorFill300};
  }

  ${disabled &&
  `
    background-color: ${basicColorFill200};
    border-left: 1px solid ${basicColorFill400};
  `}
`;

export const dropdownOptionGroup = css`
  position: absolute;
  z-index: 100;
  top: 100%;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${basicColorFillWhite};
  box-shadow: 0 2px 2px ${basicColorStroke700};
`;

export const dropdownOption = css`
  box-sizing: border-box;
  text-align: left;
  width: 100%;
  height: 20px;
  padding-left: 6px;
  border: 0;
  font-size: ${rightToolpaneDropdownListFontSizes};
  font-family: inherit;
  background-color: transparent;

  &:hover {
    background-color: ${primaryColorFill300};
  }
`;

export const imageDropdownOption = css`
  box-sizing: border-box;
  width: 100%;
  height: 20px;
  border: 0;
  background-color: transparent;

  &:hover {
    background-color: ${primaryColorFill300};
  }
`;

export const dropdownUnit = css`
  font-size: 12px;
  margin-right: 8px;
  color: #7e7e7e;
`;

export const defaultValue = css`
  opacity: 0.3;
`;

export const dropdownStyle = (disabled: boolean) => css`
  position: relative;
  width: 136px;
  height: 28px;
  font-size: 12px;
  box-sizing: border-box;
  user-select: none;

  &:focus-within {
    border: 1px solid ${primaryColorFill300};
    border-radius: 6px;
  }

  ${disabled &&
  `
    opacity: 0.3;
    pointer-events: none;
  `}
`;

export const dropResetButton = css`
  &:hover {
    background-color: ${basicColorFill400};
    border-radius: 50%;
  }
`;
