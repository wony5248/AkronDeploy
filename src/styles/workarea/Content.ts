/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { appGrayColor600, appGrayColor800, white } from 'styles/Color';

export const content = css`
  overflow: hidden; /* Editor 등의 scroll 정상화 */
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  &.isDataTab {
    background-color: ${white};
  }
`;

export const title = css`
  width: 290px;
  height: 36px;
  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${appGrayColor800};
  margin: 24px 0 0 24px;
`;

export const text = css`
  width: 336px;
  height: 32px;
  font-family: 'Spoqa Han Sans Neo';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${appGrayColor600};
  margin: 12px 0 0 24px;
`;

export const workArea = css`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: center;
  flex: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: ${white};
`;
