import { css } from '@emotion/react';

// SCSS 변수 정의
const toolpaneTitleHeight = '48px';
const toolpaneSideMargin = '8px';
const toolpaneMargin2 = '2px';
const toolpaneMinWidth = '240px';
const toolpaneMaxWidth = '500px';

// 스타일 정의
export const leftToolPane = css`
  height: 100%;
  width: auto;
  overflow: hidden;
`;

export const baseLeftToolPane = css`
  min-width: ${toolpaneMinWidth};
  max-width: ${toolpaneMaxWidth};
  height: 100%;
  padding: 0 ${toolpaneSideMargin};
`;

export const leftResourceToolPane = css`
  float: left;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const pageSorterViewComponent = css`
  // resize bar Size 반영
  height: calc(50% - 5px);
  overflow: hidden;
  flex-direction: column;
`;

export const leftToolPaneResizingBar = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 10px;
  background-color: transparent;
  cursor: ns-resize;
`;

export const leftToolPaneResizingLine = css`
  width: 100%;
  height: 1px;
  background-color: #d9d9d9;
`;

export const toolPaneContent = css`
  box-sizing: border-box;

  width: 100%;
  height: calc(100% - ${toolpaneTitleHeight});

  font-size: 11px;
  font-weight: 600;

  overflow-y: auto;
  overflow-x: hidden;

  margin-top: ${toolpaneMargin2};

  &::-webkit-scrollbar {
    width: 16px;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c9c9c9;
    border-radius: 8px;
    background-clip: padding-box;
    border: 4px solid transparent;
  }
`;

export const reverseViewer = css`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  justify-content: flex-end;
`;
