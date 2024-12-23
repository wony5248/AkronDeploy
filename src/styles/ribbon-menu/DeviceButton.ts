import { css } from '@emotion/react';
import { appGrayColor100, appGrayColor600 } from 'styles/Color';

export const deviceButton = css`
  position: absolute;
  left: calc(50% - 78px);
  width: 157px;
  height: 28px;
  line-height: 28px;
  margin: auto;
  color: ${appGrayColor100};
  border: 1px solid ${appGrayColor600};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
`;
