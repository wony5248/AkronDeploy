/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  appPrimaryColor100,
  appPrimaryColor200,
  globalGray100,
  globalGray200,
  globalGray300,
  globalGray400,
  globalGray800,
  globalWhite,
  primary100,
  primary500,
} from 'styles/Color';
import { spacing50 } from 'styles/Spacing';

export const deviceTabContainer = css`
  width: 272px;
  height: 264px;
  margin: 0 24px;
`;

export const tabView = css`
  background-color: ${globalGray100};
  display: flex;
  align-items: center;
  padding: 2px;
  margin-bottom: 5px;
  border-radius: 6px;
`;

export const tab = css`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  font-size: 13px;
  font-weight: 700;
  color: ${globalGray300};
`;

export const activeTab = css`
  color: ${primary500};
  background-color: ${globalWhite};
  border-radius: 6px;
`;

export const deviceButton = (isSelected: boolean) => css`
  width: 272px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;

  &:hover {
    background-color: ${primary100};
  }

  &:active {
    background-color: ${primary100};
  }

  ${isSelected &&
  css`
    background-color: ${primary100};
  `}
`;

export const deviceNameLabel = css`
  font-size: 12px;
  font-weight: 500;
  margin-left: 16px;
`;

export const deviceSizeLabel = css`
  font-size: 12px;
  color: ${globalGray400};
  margin-right: 16px;
`;

export const deviceCustomLabel = css`
  display: flex;
  height: 24px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 3px;
  margin-bottom: 4px;
  align-items: center;
`;

export const deviceTextField = css`
  display: inline-block;
  width: 80px;
  height: 28px;
`;

export const multiplyText = css`
  vertical-align: super;
  color: ${globalGray400};
`;

export const deviceCommonOption = css`
  display: flex;
  align-items: center;
  height: 32px;
  margin: 0 24px;
  font-size: 12px;
`;

export const deviceCommonTitle = css`
  flex: 1;
  font-size: 12px;
  font-weight: 400;
  color: ${globalGray800};
`;

export const orientationSwitchTrack = css`
  background-color: ${globalGray100};
  display: flex;
  width: 78px;
  height: 24px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;

export const disableTab = css`
  opacity: 0.3;
`;

export const rectangle = (horizontal: boolean, selected: boolean) => css`
  width: 10px;
  height: 16px;
  background-color: ${globalGray300};
  border-radius: ${spacing50};

  ${horizontal &&
  css`
    transform: rotate(90deg);
  `}

  ${selected &&
  css`
    background-color: ${primary500};
  `}
`;

export const orientationSwitchTab = css`
  width: 36px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const orientationSwitchChecked = css`
  background-color: ${globalWhite};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
`;

export const buttonContainer = css`
  height: 56px;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding-top: 0;
`;

export const button = css`
  width: 122px;
  height: 30px;

  &:not(:last-child) {
    margin-right: 0;
  }
`;

export const dialogTitle = css`
  padding: 0;
  height: 48px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export const center = css`
  padding: 0;
`;

export const line = css`
  width: 100%;
  height: 1px;
  background-color: ${globalGray200};
  margin-top: 4px;
  margin-bottom: 8px;
`;

export const listStyle = css`
  list-style: initial;
`;

export const listItem = (selected: boolean) => css`
  background-color: ${selected ? appPrimaryColor200 : 'transparent'};
  font-size: 14px;
  padding: 1px 0;
  cursor: context-menu;

  &:hover {
    background-color: ${appPrimaryColor100};
  }
`;
