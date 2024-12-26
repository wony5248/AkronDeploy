import { css } from '@emotion/react';

export const EditorStyle = css`
  width: 100%;
  height: calc(100% - 60px);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const CenterStyleWrapper = css`
  overflow: auto;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  // display: flex;
`;

export const editorArea = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  padding-top: 30px;
  padding-bottom: 30px;
  padding-right: 30px;
  padding-left: 30px;
`;

export const editor = css`
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  outline: none;

  width: 100%;
  height: 100%;
  margin: 0;

  // selection과 어긋나는 이슈와 사용성 이슈로 인해 edit mode에서는 disable
  transition: none !important;
`;
