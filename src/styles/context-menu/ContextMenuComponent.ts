import { css } from '@emotion/react';

export const contextMenu = css`
  position: absolute;

  width: fit-content;
  height: fit-content;

  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  padding: 6px 0;
  border-radius: 8px;

  z-index: 1000;
`;

export const contextMenuItemSmall = css`
  display: flex;
  align-items: center;

  min-width: 128px;
  height: 28px;

  padding: 0 12px;
  margin: 0 6px;

  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  border-radius: 6px;

  color: #222938;

  &:not(:disabled) {
    &:hover {
      cursor: pointer;
      background-color: #535d76;
      color: #ffffff;
    }

    &:active {
      cursor: pointer;
      background-color: #8d96a9;
      color: #ffffff;
    }
  }

  &:disabled {
    color: #e8e9eb;
  }
`;

export const contextMenuItemLarge = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-width: 214px;
  height: 28px;

  padding: 0 12px;
  margin: 0 6px;

  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  border-radius: 6px;

  color: #222938;

  &:not(:disabled) {
    &:hover {
      cursor: pointer;
      background-color: #535d76;
      color: #ffffff;
    }

    &:active {
      cursor: pointer;
      background-color: #8d96a9;
      color: #ffffff;
    }
  }

  &:disabled {
    color: #e8e9eb !important;
  }
`;

export const contextMenuItemMainText = css`
  display: flex;
  justify-content: start;
  align-items: center;
`;

export const contextMenuItemSubText = css`
  color: #8d96a9;

  display: flex;
  justify-content: end;
  align-items: center;
`;

export const contextMenuDivider = css`
  width: 100%;
  height: 13px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const contextMenuDividerLine = css`
  width: 100%;
  height: 1px;

  background-color: #e8e9eb;
`;
