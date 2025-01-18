/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const scrollbar = css`
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: colors.$globalGray150;
    min-height: 85px;
    border-radius: spacings.$spacing500;

    border: 3px solid transparent;
    background-clip: padding-box;
    box-sizing: border-box;

    &:hover {
      background-color: colors.$globalGray200;
    }

    &:active {
      background-color: colors.$globalGray250;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;
