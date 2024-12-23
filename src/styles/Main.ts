import { css } from '@emotion/react';
import { page } from 'styles/Mixin';

export const main = css`
  ${page};

  display: flex;
  flex-direction: column;
`;

export const dragThumbnail = css`
  * {
    cursor: not-allowed;
  }
`;
