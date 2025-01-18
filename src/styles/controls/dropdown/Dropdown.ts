/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { scrollbar } from 'styles/ScrollBar';

const xsmall = css`
  font-size: typographies.$caption2RegularFontSize;
  font-weight: typographies.$caption2RegularFontWeight;
`;

const small = css`
  font-size: typographies.$caption1RegularFontSize;
  font-weight: typographies.$caption1RegularFontWeight;
`;

const medium = css`
  font-size: typographies.$label1RegularFontSize;
  font-weight: typographies.$label1RegularFontWeight;
`;

const large = css`
  font-size: typographies.$body1RegularFontSize;
  font-weight: typographies.$body1RegularFontWeight;
`;

export const dropdown = css`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: spacings.$spacing100;
  width: 100%;

  background-color: colors.$globalWhite;

  cursor: pointer;
`;

export const title = css`
  color: colors.$globalGray500;
  font-size: typographies.$label1BoldFontSize;
  font-weight: typographies.$label1BoldFontWeight;
`;

export const dropdownToggle = (type: string) => css`
  display: flex;
  align-items: center;
  gap: spacings.$spacing100;
  width: inherit;

  padding: 0 spacings.$spacing200;
  margin: 0;
  border-radius: spacings.$spacing100;
  box-sizing: border-box;

  color: colors.$globalGray700;

  ${type === 'xsmall' &&
  `
        ${xsmall};
        height: 28px;
    `}

  ${type === 'small' &&
  `
        ${small};
        height: 32px;
    `}

    ${type === 'medium' &&
  `
        ${medium};
        height: 40px;
        border-radius: spacings.$spacing150;
    `}

     ${type === 'large' &&
  `
        ${large};
        height: 48px;
        padding: 0 spacings.$spacing250;
        border-radius: spacings.$spacing200;
    `}

    path {
    fill: colors.$globalGray400;
  }

  &[aria-expanded='true'] {
    .toggleIcon {
      transform: scaleY(-1);
    }
  }

  span {
    margin-right: auto;
  }
`;

export const placeholder = css`
  color: colors.$globalGray250;
`;

// Component properties > style : line
export const line = css`
  background-color: colors.$globalWhite;
  border: 1px solid colors.$globalGray200;
`;

// Component properties > style : fill
export const fill = css`
  background-color: colors.$globalGray50;
`;

// Component properties > style : none
export const none = css`
  background-color: transparent;
  border: 1px solid transparent;

  &[aria-expanded='true'] {
    background-color: colors.$globalWhite;
    border: 1px solid colors.$globalGray200;
  }
`;

export const menu = (type: string) => css`
  ${scrollbar};
  cursor: pointer;
  overflow-y: auto;
  overflow-x: hidden;

  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;

  width: 100%;
  min-width: 120px;
  max-height: 300px;
  background-color: colors.$globalWhite;
  padding: spacings.$spacing100;
  margin: 0;
  box-sizing: border-box;

  ${type === 'xsmall' &&
  `
        border-radius: spacings.$spacing100;
    `}

  ${type === 'small' &&
  `
        border-radius: spacings.$spacing100;
    `}

   ${type === 'medium' &&
  `
        border-radius: spacings.$spacing150;
    `}

    ${type === 'large' &&
  `
        max-height: 370px;
        border-radius: spacings.$spacing200;
    `}

    ${type === 'line' &&
  `
        border: 1px solid colors.$globalGray200;
    `}

    ${type === 'fill' &&
  `
        padding: 0;
        border: 0;
    `}

    ${type === 'none' &&
  `
        border: 1px solid colors.$globalGray200;
    `}
`;

export const menuItem = (type: string) => css`
  margin: 0;
  display: flex;
  list-style: none;
  align-items: center;
  gap: spacings.$spacing100;
  padding: 0 spacings.$spacing100;
  justify-content: space-between;

  span {
    margin-right: auto;
  }

  svg {
    path {
      fill: colors.$globalGray400;
    }
  }

  ${type === 'xsmall' &&
  `
        ${xsmall};
        height: 28px;
        border-radius: spacings.$spacing100;
    `}

  ${type === 'small' &&
  `
        ${small};
        height: 30px;
        border-radius: spacings.$spacing100;
    `}

   ${type === 'medium' &&
  `
        ${medium};
        height: 40px;
        border-radius: spacings.$spacing150;
    `}

    ${type === 'large' &&
  `
        ${large};
        height: 48px;
        border-radius: spacings.$spacing150;
    `}

    ${(type === 'line' || type === 'none') &&
  `
        background-color: colors.$globalWhite;

        &:hover {
            background-color: colors.$globalGray50;
        }

        &:active {
            background-color: colors.$globalGray100;
        }
    `}

    ${type === 'fill' &&
  `
        background-color: colors.$globalGray50;

        &:hover {
            background-color: colors.$globalGray100;
        }

        &:active {
            background-color: colors.$globalGray150;
        }
    `}
`;
