import { css } from '@emotion/react';

export const dialog = css`
  min-width: 280px;
  width: 280px;
  display: flex;
  flex-direction: column;
  justify-items: center;

  background: #ffffff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);

  font-family: 'Apple SD Gothic Neo';
  font-size: 18px;
  border-radius: 8px;
  padding: 0 20px;
`;

export const dialogContent = css`
  box-sizing: border-box;
  display: flex;
  font-size: 13px;
`;

export const dialogFooter = css`
  justify-content: center;
  height: 100%;
  margin: 12px 0 20px;
  padding: 0;
`;

export const dialogButton = css`
  width: 100%;
  height: 32px;
  margin: 0;
  background-color: #205eff !important;
`;

export const imageResource = css`
  display: flex;
`;

export const dialogRenameOKButton = css`
  background-color: #205eff !important;
`;

export const dialogPageRenameText = css`
  font-family: 'Apple SD Gothic Neo';
  color: #205eff !important;
  font-size: 12px;
  font-weight: bold;
`;

export const dialogPageRenameAlertText = css`
  font-family: 'Apple SD Gothic Neo';
  font-size: 13px;
`;

export const errorText = css`
  width: 240px;
  height: 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #ff0000;
  margin-left: 7px;
  margin-top: -13px;
  margin-bottom: 16px;
`;
