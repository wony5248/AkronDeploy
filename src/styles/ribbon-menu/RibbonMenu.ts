import { css } from '@emotion/react';
import { appGrayColor400, appGrayColor600, white } from 'styles/Color';
import { cancelReset } from 'styles/Mixin';
import { menuZIndex } from 'styles/MUIZIndex';

export const ribbonMenu = css`
  ${cancelReset};
  display: flex;
  width: 100%;
  height: 56px;
  background-color: #222938;
`;

export const leftMenu = css`
  display: flex;
  margin-left: 20px;
  gap: 20px;
  align-items: center;
`;

export const rightMenu = css`
  width: fit-content;
  height: 100%;
  display: flex;
  margin-left: auto;
  margin-right: 20px;
  gap: 20px;
  align-items: center;
`;

export const ribbonDropdownButton = css`
  display: flex;
  user-select: none;
  align-items: center;
  height: 18px;

  &.selected,
  &:hover,
  &:active {
    opacity: 40%;
  }
`;

export const ribbonDropdownMenu = css`
  z-index: ${menuZIndex} !important;
`;

export const ribbonDropdownButtonIcon = css`
  height: 18px;
  align-items: center;
  display: flex;
`;

export const ribbonButtonLabel = css`
  height: 18px;
  display: flex;
  font-family: inherit;
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  color: ${white};
  padding-left: 6px;
  padding-right: 5px;
  white-space: pre-wrap;
  word-break: break-all;
`;

export const playButton = css`
  width: 32px;
  height: 32px;

  &:hover {
    background-color: ${appGrayColor600};
  }
`;

export const publishButton = css`
  width: 88px;
  height: 32px;
  color: ${white};
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  background: ${appGrayColor600};

  &.exit {
    background-color: ${appGrayColor400};
  }

  &:hover,
  &:active {
    background: ${appGrayColor600};
  }
`;
