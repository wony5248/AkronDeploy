import { css } from '@emotion/react';
import {
  menuItemBase,
  menuItemImageBase,
  menuItemLabelBase,
  menuItemWrapperBase,
} from 'styles/ribbon-menu/menu-item/MenuItem';

export const menuItem = css`
  padding: 0 !important;
  opacity: 1 !important;
`;

export const menuItemWrapper = (disabled: boolean) => css`
  ${menuItemBase(disabled)};
`;

export const menuItemContent = css`
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

export const subMenuArrowIcon = css`
  margin-left: auto;
  margin-right: 12px;
`;

export const subMenuWrapper = css`
  background-color: #ffffff;
  padding: 8px 0;
  box-shadow:
    0 5px 5px -3px rgb(0 0 0 / 20%),
    0 8px 10px 1px rgb(0 0 0 / 14%),
    0 3px 14px 2px rgb(0 0 0 / 12%);
  border-radius: 4px;
`;
