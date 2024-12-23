/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { primaryColorFill100 } from 'styles/Color';
import {
  toolPaneSliderPaddingBottom,
  toolPaneSliderPaddingLeft,
  toolPaneSliderPaddingRight,
  toolPaneSliderPaddingTop,
} from 'styles/Size';

// toolPaneTitle 스타일
export const toolPaneTitle = css`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  white-space: nowrap;

  width: 100%;
  margin-top: calc(${toolPaneSliderPaddingTop} - ${toolPaneSliderPaddingBottom});
  padding-top: ${toolPaneSliderPaddingBottom};
  padding-right: ${toolPaneSliderPaddingRight};
  padding-bottom: ${toolPaneSliderPaddingBottom};
  padding-left: ${toolPaneSliderPaddingLeft};

  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  user-select: none;

  &.isDraggable {
    -webkit-app-region: drag;
  }
`;

// toolPaneTitleButtonGroup 스타일
export const toolPaneTitleButtonGroup = css`
  margin-left: auto;
  -webkit-app-region: no-drag;
`;

// toolPaneTitleButton 공통 믹스인
const toolPaneTitleButton = css`
  cursor: pointer;
  border: 0;
  background-color: transparent;

  &:hover {
    background-color: ${primaryColorFill100};
  }
`;

// toolPanePopupButton 스타일
export const toolPanePopupButton = css`
  ${toolPaneTitleButton};
  margin-right: 0.5rem;
`;

// toolPaneCloseButton 스타일
export const toolPaneCloseButton = css`
  ${toolPaneTitleButton};
`;

export const leftToolpaneTitle = css`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  white-space: nowrap;

  width: 100%;
  height: 48px;

  align-items: center;

  font-weight: 700;

  user-select: none;
  line-height: 16px;
  font-size: 12px;
  padding: 0 8px;
`;

export const leftToolpaneTitleButton = css`
  cursor: pointer;

  &:hover {
    background-color: variables.$appPrimaryColor100;
  }

  &:active {
    background-color: variables.$appPrimaryColor100;
  }
`;
