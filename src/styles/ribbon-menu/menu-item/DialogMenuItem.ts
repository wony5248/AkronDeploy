import { css } from '@emotion/react';
import {
  menuItemBase,
  menuItemImageBase,
  menuItemLabelBase,
  menuItemWrapperBase,
} from 'styles/ribbon-menu/menu-item/MenuItem';

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

export const menuItemDialogIcon = css`
  padding-top: 4px;
`;

export const menuNoImageItemLabel = css`
  ${menuItemLabelBase};
  margin-left: 12px;
`;
