import { css } from '@emotion/react';
import {
  appGrayColor100,
  appGrayColor300,
  appGrayColor500,
  appGrayColor600,
  appGrayColor800,
  appPrimaryColor200,
  appPrimaryColor500,
  white,
} from 'styles/Color';

export const saveMessageContainer = css`
  position: fixed;
  right: 4px;
  top: 98px;
  z-index: 1400;
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 4px;

  &.forComplete {
    background-color: #eefff3;
    border-left: 4px solid #23a047;
    flex-direction: row;
  }

  &.forError {
    background-color: #fff6f8;
    border-left: 4px solid #f44336;
    flex-direction: column;
  }
`;

export const saveIcon = css`
  width: 32px;
  height: 32px;
`;

export const saveMessageTitle = css`
  width: 292px;
  color: ${appGrayColor800};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const saveMessageText = css`
  white-space: nowrap;
  color: ${appGrayColor800};
  font-size: 14px;
  font-weight: 400;
`;

export const lastSavedTime = css`
  width: 292px;
  white-space: nowrap;
  width: fit-content;
  font-weight: 400;

  &.forComplete {
    font-size: 12px;
    margin: 0 12px;
    padding-right: 70px;
    color: ${appGrayColor600};
  }

  &.forError {
    font-size: 10px;
    margin-top: 2px;
    color: ${appGrayColor500};
  }
`;

export const reloadButtonContainer = css`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
`;

export const reloadButton = css`
  border-radius: 6px;
  border: 0.8px solid ${appGrayColor600};
  color: ${appGrayColor600};
  font-size: 12px;
  font-weight: 400;
  padding: 8px 16px;
  z-index: 1400;
  cursor: pointer;
`;

export const saveLoading = css`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1400;
  background-color: rgba(51, 51, 51, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const saveErrorPage = css`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1500;
  flex-direction: column;
  background-color: ${appGrayColor100};
  justify-content: center;
  align-items: center;
`;

export const saveErrorPageTitle = css`
  font-size: 18px;
  font-weight: 700;
  margin-top: 24px;
  color: ${appGrayColor800};
`;

export const saveErrorPageText = css`
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
  color: ${appGrayColor600};
`;

export const saveErrorPageButton = css`
  padding: 5px 32px;
  margin-top: 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;

  &.forReload {
    background-color: ${appPrimaryColor200};
    color: ${appPrimaryColor500};
    margin-top: 20px;
  }

  &.forLanding {
    background-color: ${appGrayColor300};
    color: ${white};
  }
`;

export const popover = css`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1300;
`;
