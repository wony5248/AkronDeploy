import { css } from '@emotion/react';
import { appGrayColor100, white } from 'styles/Color';

export const separatorItem = css`
  display: flex;
  width: 100%;
  height: 13px;
  background-color: ${white};
`;

export const separatorLine = css`
  position: relative;
  top: 6px;
  width: 100%;
  height: 1px;
  background-color: ${appGrayColor100};
`;
