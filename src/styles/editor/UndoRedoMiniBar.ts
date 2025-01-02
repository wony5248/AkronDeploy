import { css } from '@emotion/react';
import { appGrayColor200, appGrayColor500, white } from 'styles/Color';

export const miniZoomNudgeWrapper = css`
  width: 60px;
  height: 28px;
  border-radius: 1px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background: ${white};
  border: 1px solid ${appGrayColor200};
  border-radius: 4px;
  box-sizing: border-box;
`;

export const undoButtonWrapper = css`
  display: flex;
  justify-content: center;
  width: 30px;
  height: 28px;
  text-align: center;
  border: solid 1px ${appGrayColor200};
`;

export const redoButtonWrapper = css`
  display: flex;
  justify-content: center;
  width: 30px;
  height: 28px;
  text-align: center;
  border: solid 1px ${appGrayColor200};
`;

export const basicColor = css`
  color: ${appGrayColor500};

  path {
    fill: currentColor;
  }
`;

export const disableColor = css`
  color: ${appGrayColor500};
  opacity: 0.4;

  path {
    fill: currentColor;
  }
`;
