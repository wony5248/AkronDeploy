/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { appPrimaryColor100, appPrimaryColor200, black } from 'styles/Color';

interface NameAreaProps {
  isTop: boolean;
  isLeaf: boolean;
  isSelected: boolean;
}

// 기본 스타일
export const treeNode = css`
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const nameArea = ({ isTop, isLeaf, isSelected }: NameAreaProps) => css`
  user-select: none;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 32px;
  border-radius: 8px;

  border: 0;
  background-color: transparent;

  font-family: inherit;
  font-size: ${isTop ? '10px' : 'inherit'};

  ${isLeaf && !isTop && `font-weight: 400;`}

  ${isSelected && `background-color: ${appPrimaryColor200};`}

  &:hover {
    background-color: ${appPrimaryColor100};
  }
`;

export const openButton = css`
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  transform-origin: center;
`;

export const lockIconArea = css`
  display: flex;
  justify-content: center;

  width: 16px;
  margin-right: 4px;
`;

export const hideIconArea = css`
  display: flex;
  justify-content: center;

  width: 16px;
  margin-right: 7px;
`;

export const openIcon = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  height: 100%;
`;

export const nameButtonArea = css`
  width: 100%;
  height: 100%;
`;

export const nameButton = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex: 1;
  width: 100%;
  height: 16px;
`;

export const childrenArea = css`
  box-sizing: border-box;

  width: 100%;
  padding-left: 16px;

  display: flex;
  flex-direction: column-reverse;
`;

export const nameButtomTop = css`
  width: 100%;
  height: 8px;
  box-sizing: border-box;

  &:hover {
    border-top: 2px solid ${black};
  }
`;

export const nameButtonBottom = css`
  width: 100%;
  height: 8px;
  box-sizing: border-box;

  &:hover {
    border-bottom: 2px solid ${black};
  }
`;

export const nameButtonBottomInner = css`
  float: right;
  width: 90%;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    border-bottom: 2px solid ${black};
  }
`;
