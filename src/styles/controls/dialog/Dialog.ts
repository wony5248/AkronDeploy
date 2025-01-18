import { css } from '@emotion/react';
import { globalGray600, globalGray900, globalWhite } from 'styles/Color';
import {
  spacing100,
  spacing150,
  spacing200,
  spacing250,
  spacing300,
  spacing50,
  spacing600,
  spacing700,
  spacing800,
} from 'styles/Spacing';
import {
  body1RegularFontSize,
  body1RegularFontWeight,
  body1RegularLineHeight,
  caption1RegularFontSize,
  caption1RegularFontWeight,
  caption1RegularLineHeight,
  heading2StrongFontSize,
  heading2StrongFontWeight,
  heading2StrongLineHeight,
  headline1BoldFontSize,
  headline1BoldFontWeight,
  headline1BoldLineHeight,
  label1RegularFontSize,
  label1RegularFontWeight,
  label1RegularLineHeight,
  title3BoldFontSize,
  title3BoldFontWeight,
  title3BoldLineHeight,
} from 'styles/Typographies';
import { dialogZIndex } from 'styles/ZIndex';

// Dialog 스타일
export const dialog = (size: string) => css`
  z-index: ${dialogZIndex};
  user-select: unset;
  background-color: ${globalWhite};
  box-shadow: 0 4px 20px -6px rgba(16, 23, 40, 0.24);
  border: 0;
  border-radius: ${spacing300};
  overflow: hidden;
  height: fit-content;
  padding: 0;
  margin: 0;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  outline: none;

  ${size === 'xsmall' && `width: 420px;`}
  ${size === 'small' && `width: 560px;`}
    ${size === 'medium' && `width: 720px;`}
    ${size === 'large' && `width: 920px;`}
`;

// Backdrop 스타일
export const backdrop = css`
  z-index: ${dialogZIndex - 1};
  background-color: transparent;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
`;

// Header 스타일
export const header = (size: string) => css`
  display: flex;
  flex-direction: row;

  ${size === 'xsmall' || size === 'small'
    ? `padding: ${spacing600} ${spacing600} ${spacing200};`
    : size === 'small'
      ? `padding: ${spacing700} ${spacing700} ${spacing250};`
      : size === 'large' && `padding: ${spacing800} ${spacing800} ${spacing250};`}
`;

// HeaderContent, LabelWrapper 스타일
export const headerContent = (size: string) => css`
  display: flex;
  flex-direction: column;
  min-width: fit-content;

  ${size === 'xsmall' && `gap: ${spacing100};`}
  ${size === 'small' && `gap: ${spacing150};`}
    ${(size === 'medium' || size === 'large') && `gap: ${spacing200};`}
`;

// HeaderDetail 스타일
export const headerDetail = css`
  display: flex;
  flex-direction: row;
`;

// StatusIcon 스타일
export const statusIcon = css`
  margin-right: ${spacing200};
  min-height: fit-content;
`;

// Title 스타일
export const title = (size: string) => css`
  color: ${globalGray900};

  ${size === 'xsmall' &&
  `
      font-size: ${headline1BoldFontSize};
      font-weight: ${headline1BoldFontWeight};
      line-height: ${headline1BoldLineHeight};
    `}
  ${(size === 'small' || size === 'medium') &&
  `
      font-size: ${heading2StrongFontSize};
      font-weight: ${heading2StrongFontWeight};
      line-height: ${heading2StrongLineHeight};
    `}
    ${size === 'large' &&
  `
      font-size: ${title3BoldFontSize};
      font-weight: ${title3BoldFontWeight};
      line-height: ${title3BoldLineHeight};
    `}
`;

// SubText 스타일
export const subText = (size: string) => css`
  color: ${globalGray600};

  ${size === 'xsmall' &&
  `
      font-size: ${caption1RegularFontSize};
      font-weight: ${caption1RegularFontWeight};
      line-height: ${caption1RegularLineHeight};
    `}
  ${(size === 'small' || size === 'medium') &&
  `
      font-size: ${label1RegularFontSize};
      font-weight: ${label1RegularFontWeight};
      line-height: ${label1RegularLineHeight};
    `}
    ${size === 'large' &&
  `
      font-size: ${body1RegularFontSize};
      font-weight: ${body1RegularFontWeight};
      line-height: ${body1RegularLineHeight};
    `}
`;

// Dropdown 스타일
export const dropdown = css`
  display: flex;
  position: relative;
  height: 28px;
  margin-left: ${spacing50};

  &[aria-expanded='true'] {
    .dropdownIcon {
      transform: scaleY(-1);
    }
  }
`;

// DropdownIcon 스타일
export const dropdownIcon = css`
  cursor: pointer;
`;

// DropdownLargeIcon 스타일
export const dropdownLargeIcon = css`
  height: 32px;

  svg {
    height: 32px;
    width: 32px;
  }
`;

// CloseButton 스타일
export const closeButton = css`
  cursor: pointer;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  margin-left: auto;
`;

// ContentWrapper 스타일
export const contentWrapper = (size: string) => css`
  box-sizing: border-box;
  height: fit-content;
  min-height: 235px;

  ${(size === 'xsmall' || size === 'small') && `padding: ${spacing300} ${spacing600};`}
  ${size === 'medium' && `padding: ${spacing300} ${spacing700};`}
    ${size === 'large' && `padding: ${spacing300} ${spacing800};`}
`;

// Bottom 스타일
export const bottom = (size: string) => css`
  display: flex;
  justify-content: end;
  gap: ${spacing200};

  ${(size === 'xsmall' || size === 'small') && `padding: ${spacing200} ${spacing600} ${spacing600};`}
  ${size === 'medium' && `padding: ${spacing250} ${spacing700} ${spacing700};`}
    ${size === 'large' && `padding: ${spacing250} ${spacing800} ${spacing800};`}
`;
