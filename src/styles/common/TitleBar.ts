import { css } from '@emotion/react';

export const titleBar = css`
  display: flex;
  flex-direction: row;
  -webkit-app-region: drag;
  width: 100%;
  min-height: 38px;
  background-color: #101728;
`;

export const home = css`
  display: flex;
  position: absolute;
  width: 40px;
  height: 38px;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #1d263a;
  }
`;

export const children = css`
  position: absolute;
  top: 10px;
  left: 46px;
  height: 16px;
  line-height: 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
`;

export const controls = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-left: auto;
  padding-right: 12px;
  padding-top: 11px;
  gap: 4px;
`;

export const control = css`
  width: 16px;
  height: 15px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;
