import { css } from '@emotion/react';
import {
  appGrayColor100,
  appGrayColor200,
  appGrayColor250,
  appGrayColor300,
  appGrayColor500,
  appGrayColor600,
  appPrimaryColor400,
  white,
} from 'styles/Color';

export const componentInsertToolPane = css`
  float: right;
  height: 100%;
  transition: width 0.4s ease-in-out, border-color 0.4s ease-in-out;
  margin-left: 1px;
  background-color: ${white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2};
`;

export const tabLabel = (isSelected: boolean) => css`
  color: ${isSelected ? '${appGrayColor800)' : '${appGrayColor400)'};
  font-family: 'Spoqa Han Sans Neo';
  font-size: 11px;
  text-transform: none;
  line-height: ${isSelected ? '16px' : '13.77px'};
  font-weight: ${isSelected ? 700 : 400};
`;

export const toolPaneComponentTabPanel = css`
  box-sizing: border-box;
  height: 100%;
  height: calc(100% - 16px);
  padding-left: 16px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 16px;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${appGrayColor200};
    border-radius: 4px;
    background-clip: padding-box;
    border: 6px solid transparent;
    width: 4px;
    height: 40px;

    &:hover {
      background-color: ${appGrayColor250};
    }

    &:active {
      background-color: ${appGrayColor300};
    }
  }
`;

export const toolPaneContent = css`
  height: calc(100% - 1px);
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const toolPaneTabPanel = css`
  height: calc(100% - 121px);
  outline: none;
`;

export const toolPaneComponentCategory = css`
  width: 228px;
  height: 32px;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
`;

export const toolPaneComponentCategoryButton = css`
  fill: none;
`;

export const toolPaneComponentCategoryTitle = css`
  display: inline-block;
  width: 160px;
  height: 16px;
  font-size: 12px;
  font-weight: 600;
  line-height: 14.52px;
  margin-left: 9px;
  color: ${appGrayColor500};
  font-family: 'Inter';
`;

export const toolPaneComponentCategoryItems = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
  margin-bottom: 14px;
`;

export const toolPaneComponentButton = css`
  display: flex;
  width: 72px;
  height: 80px;
  background-color: ${white};
  font-size: 12px;
  font-weight: 400;
  user-select: none;
  justify-content: center;
  -webkit-app-region: no-drag;
`;

export const toolPaneComponentButtonWrapper = (isDisabled: boolean, isSelected: boolean) => css`
  display: flex;
  flex-direction: column;
  width: 72px;
  height: 80px;
  background-color: ${isDisabled ? '${white)' : isSelected ? '${uxButtonActiveColor)' : '${white)'};
  border-radius: 6px;
  opacity: ${isDisabled ? 0.3 : 1};
  pointer-events: ${isDisabled ? 'none' : 'auto'};

  &:hover {
    background-color: ${!isDisabled && !isSelected ? '${appPrimaryColor100)' : ''};
  }

  &:active {
    background-color: ${!isDisabled && isSelected ? '${appPrimaryColor100)' : ''};
    box-shadow: ${!isDisabled && isSelected ? '0 0 0 1px ${appPrimaryColor300) inset' : ''};
  }
`;

export const toolPaneComponentButtonImage = css`
  width: 72px;
  height: 44px;
  pointer-events: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const toolPaneComponentButtonLabelWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 36px;
  overflow: hidden;
`;

export const toolPaneComponentButtonLabel = css`
  font-size: 11px;
  font-weight: 400;
  font-family: 'Inter';
  line-height: 11px;
  color: ${appGrayColor500};
  opacity: 1;
  text-align: center;
  user-select: none;
  white-space: normal;
  word-break: break-all;
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
`;

export const addLibraryWrapper = css`
  width: 208px;
  height: 207px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: 1px dashed ${appGrayColor250};
  background-color: ${appGrayColor100};
  box-sizing: border-box;
  margin: auto;
`;

export const addLibraryText = css`
  color: ${appGrayColor600};
  font-size: 12px;
  font-weight: 400;
  line-height: 17.34px;
`;

export const addLibraryButton = css`
  color: ${appPrimaryColor400};
  font-size: 12px;
  font-weight: 600;
  line-height: 17.34px;
  text-decoration: underline;
  cursor: pointer;
`;
