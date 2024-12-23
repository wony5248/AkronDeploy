/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { basicColorFillWhite, grayColor200 } from 'styles/Color';
import { rightToolpaneAreaWidth, rightToolpanePadding, toolPaneSliderWidth } from 'styles/Size';

export const toolPaneArea = css`
  background-color: ${basicColorFillWhite};
  display: flex;
  flex-direction: column;
  width: ${rightToolpaneAreaWidth};
  border-left: 1px solid ${grayColor200};
`;

export const toolPane = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const toolPanePopup = css`
  width: ${toolPaneSliderWidth};
  height: 99%; /* Window의 scrollbar 제거를 위해 꽉 차지 않게 함 */
`;

export const toolPaneDock = css`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background-color: #ffffff;
  align-items: center;
  padding-left: ${rightToolpanePadding};
  gap: 10px;
`;
