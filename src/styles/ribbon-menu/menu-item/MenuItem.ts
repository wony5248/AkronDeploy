import { css } from '@emotion/react';
import { appGrayColor800, appPrimaryColor500, white } from 'styles/Color';

export const menuItemBase = (disabled: boolean) => css`
  display: flex;
  width: calc(100% - 12px);
  height: 28px;
  padding: 0 6px;
  background-color: ${white};

  ${disabled &&
  css`
    opacity: 0.3;
    background-color: ${white};
    pointer-events: none;
  `}
`;

export const menuItemWrapperBase = css`
  white-space: nowrap;
  display: flex;
  align-items: center;

  width: 100%;
  height: 28px;
  border-radius: 6px;

  &:hover,
  &:active {
    background-color: ${appPrimaryColor500};

    .menuItemLabel {
      color: ${white};
    }
  }
`;

export const menuItemImageBase = css`
  width: 14px;
  height: 14px;
  padding-left: 8px;
  padding-right: 4px;
  user-select: none;
  pointer-events: none;
  background-color: transparent;
  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;

    height: 100%;
  }
`;

export const menuItemLabelBase = css`
  display: flex;
  align-items: center;
  margin-right: 12px;
  font-family: 'SpoqaHanSansNeo';
  font-size: 11px;
  font-weight: 400;
  color: ${appGrayColor800};
  user-select: none;
`;

export const menuItem = (disabled: boolean) => css`
  ${menuItemBase(disabled)};
`;

export const menuItemWrapper = css`
  ${menuItemWrapperBase};
`;

export const menuItemImage = css`
  ${menuItemImageBase};
`;

export const menuItemLabel = css`
  ${menuItemLabelBase};
`;

export const menuNoImageItemLabel = css`
  ${menuItemLabelBase};
  margin-left: 12px;
`;
