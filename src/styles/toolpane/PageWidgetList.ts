import { css } from '@emotion/react';
import { appPrimaryColor150, appPrimaryColor200, basicColorFill600, basicColorFill900 } from 'styles/Color';
import { selectionOverlayZIndex } from 'styles/MUIZIndex';

export const pageWidgetList = css`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

export const pageWidgetSection = css`
  margin-bottom: 10px;
`;

export const pageThumbnail = (isSelected: boolean) => css`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 34px;
  padding-left: 22px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 8px;
  background-color: ${isSelected ? appPrimaryColor200 : 'transparent'};

  &:hover {
    background-color: ${appPrimaryColor150};
  }
`;

export const pageThumbnailImg = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  outline: none;
  position: relative;
  margin-left: 22px;
  overflow: hidden;
  width: 140px;
  border: solid 2px #e6e6e6;
  border-radius: 6px;

  &.isSelected {
    border-color: #6d71f9;
    border-width: 3px;
  }

  &:hover {
    border-color: #6d71f9;
  }
`;

export const pageThumbnailArrow = css`
  display: inline;

  &.hidden {
    visibility: hidden;
  }
`;

export const pageThumbnailTitle = css`
  display: flex;
  align-items: center;
  width: 85%;
  min-height: 16px;
`;

export const pageThumbnailIndex = css`
  font-size: 12px;
  color: ${basicColorFill600};
  letter-spacing: 0;
  font-weight: 600;

  &.hidden {
    text-decoration: line-through;
  }
`;

export const pageThumbnailName = css`
  font-size: 12px;
  color: ${basicColorFill900};
  letter-spacing: 0;
  font-weight: 400;
  margin-left: 10px;
  text-overflow: ellipsis;
  width: 85%;
  overflow: hidden;
  white-space: nowrap;

  &.hidden {
    text-decoration: line-through;
  }
`;

export const pageThumbnailIcon = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

export const pageSection = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 30px;
  padding-top: 10px;
  padding-left: 10px;
  border-radius: 8px;

  &.isSelected {
    background-color: ${appPrimaryColor200};
  }
`;

export const pageSectionLabel = css`
  font-size: 12px;
  font-weight: 600;
  padding-left: 8px;
`;

export const ghostItem = css`
  background-color: #eeeffd;
  width: 140px;
  height: 8px;
  border-top: #6d71f9 solid 1px;
  border-bottom: #6d71f9 solid 1px;
  margin-top: 15px;
  margin-bottom: 15px;

  .pageThumbnailTitle {
    display: none;
  }

  .pageThumbnailImg {
    display: none;
  }
`;

export const pageChosenMulti = css`
  display: none;
`;

export const sectionChosen = css`
  display: none;
`;

export const pageThumbnailItemContainer = css`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const pageThumbnailItemOverlay = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${selectionOverlayZIndex} !important;
`;

export const pageThumbnailItem = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const dragPageOverlay = css`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

export const dragPageNumber = css`
  display: inline-block;
  background-color: #6d71f9;
  color: rgb(255, 255, 255);
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;
