import { css } from '@emotion/react';
import {
  appGrayColor100,
  appGrayColor400,
  appGrayColor50,
  appGrayColor600,
  appPrimaryColor150,
  appPrimaryColor250,
  white,
} from 'styles/Color';

export const openFileDialogWrapper = css`
  width: 520px;
  height: 450px;
`;

export const openFileDialogTitle = css`
  height: 70px;
  padding: 0;
  align-items: center;
`;

export const openFileDialogSearchBar = css`
  width: 100%;
  height: 32px;
  border: 1px solid ${appGrayColor50};
  background-color: ${appGrayColor50};
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;

  div {
    width: 28px;
    height: 28px;
  }
`;

export const openFileDialogSearchBarInput = css`
  width: 300px;
  height: 28px;
  font-size: 11px;
  font-weight: 400;
  line-height: 28px;
  color: ${appGrayColor600};
  border: 0;
  outline: 0;
  background-color: transparent;
`;

export const openFileDialogContent = css`
  width: calc(100% - 2px);
  height: 308px; // searchBar 생기면 260px
`;

export const openFileDialogLibraryListWrapper = css`
  width: 100%;
  height: 260px;
  border: 1px solid ${appGrayColor100};
  border-radius: 12px;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    border-radius: 7px;
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: #d2d2d2;
    border: 4px solid ${white};
  }
`;

export const openFileDialogLibraryList = css`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const openFileDialogLibraryItem = (selected: boolean) => css`
  width: 472px;
  height: 52px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  align-items: center;
  text-align: start;

  &:hover {
    background-color: ${appPrimaryColor150};
  }

  ${selected &&
  css`
    background-color: ${appPrimaryColor250};
  `}
`;

export const appName = css`
  width: 230px;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const roomName = css`{
    width: 122px;

    color: ${appGrayColor400};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

export const openFileDialogTimeStamp = css`
  width: 88px;
  text-align: right;

  color: ${appGrayColor400};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const openFileDialogFooter = css`
  width: 100%;
  height: 72px;
  padding: 0;
  align-items: center;
`;
