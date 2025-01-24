import { css } from '@emotion/react';
import { globalGray900, globalWhite } from 'styles/Color';
import { spacing300 } from 'styles/Spacing';
import { dialogZIndex } from 'styles/ZIndex';

export const popover = (size: string) => css`
  z-index: ${dialogZIndex};
  user-select: unset;
  background-color: ${globalWhite};
  box-shadow: 0 4px 16px -6px rgba(16, 23, 40, 0.24);
  border: 0;
  border-radius: ${spacing300};
  overflow: hidden;
  height: fit-content;
  padding: 0;
  margin: 0;

  position: absolute;

  ${size === 'xsmall' &&
  css`
    width: 420px;
  `}
  ${size === 'small' &&
  css`
    width: 560px;
  `}
        ${size === 'medium' &&
  css`
    width: 720px;
  `}
        ${size === 'large' &&
  css`
    width: 920px;
  `}
`;
