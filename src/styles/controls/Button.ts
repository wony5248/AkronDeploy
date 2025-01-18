/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import * as path from 'path';
import {
  primary250,
  primary600,
  globalWhite,
  globalGray250,
  globalGray300,
  globalGray400,
  globalGray700,
  primary500,
  primary700,
  globalGray600,
  globalGray800,
  globalGray200,
  primary50,
  primary400,
  primary100,
  primary200,
  globalGray50,
  globalGray100,
  globalGray150,
} from 'styles/Color';
import { spacing150, spacing300, spacing100, spacing500, spacing600, spacing700, spacing200 } from 'styles/Spacing';
import {
  caption1BoldFontSize,
  caption1BoldFontWeight,
  caption1BoldLineHeight,
  label1BoldFontSize,
  label1BoldFontWeight,
  label1BoldLineHeight,
  body1BoldFontSize,
  body1BoldFontWeight,
  body1BoldLineHeight,
  headline1BoldFontSize,
  headline1BoldFontWeight,
  headline1BoldLineHeight,
} from 'styles/Typographies';
import { content } from 'styles/workarea/Content';

// SVG Styles
export const primary250Svg = css`
  path {
    fill: ${primary250};
  }
`;

export const primary600Svg = css`
  path {
    fill: ${primary600};
  }
`;

export const whiteSvg = css`
  path {
    fill: ${globalWhite};
  }
`;

export const gray250Svg = css`
  path {
    fill: ${globalGray250};
  }
`;

export const gray300Svg = css`
  path {
    fill: ${globalGray300};
  }
`;

export const gray400Svg = css`
  path {
    fill: ${globalGray400};
  }
`;

export const gray700Svg = css`
  path {
    fill: ${globalGray700};
  }
`;

// Button Base Style
export const buttonBase = css`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing150};
  width: fit-content;
  border-radius: 6px;
`;

// Size-based styles
export const button = (size: string) => {
  switch (size) {
    case 'xsmall':
      return css`
        height: 36px;
        min-height: 36px;
        padding: 0 ${spacing300};
        gap: ${spacing100};
        font-size: ${caption1BoldFontSize};
        font-weight: ${caption1BoldFontWeight};
        line-height: ${caption1BoldLineHeight};

        svg {
          width: 16px;
          height: 16px;
        }
      `;
    case 'small':
      return css`
        height: 40px;
        min-height: 40px;
        padding: 0 ${spacing500};
        font-size: ${label1BoldFontSize};
        font-weight: ${label1BoldFontWeight};
        line-height: ${label1BoldLineHeight};

        svg {
          width: 20px;
          height: 20px;
        }
      `;
    case 'medium':
      return css`
        height: 48px;
        min-height: 48px;
        padding: 0 ${spacing600};
        font-size: ${body1BoldFontSize};
        font-weight: ${body1BoldFontWeight};
        line-height: ${body1BoldLineHeight};

        svg {
          width: 20px;
          height: 20px;
        }
      `;
    case 'large':
      return css`
        height: 58px;
        min-height: 58px;
        padding: 0 ${spacing700};
        border-radius: 8px;
        gap: ${spacing200};
        font-size: ${headline1BoldFontSize};
        font-weight: ${headline1BoldFontWeight};
        line-height: ${headline1BoldLineHeight};

        svg {
          width: 24px;
          height: 24px;
        }
      `;
    default:
      return null;
  }
};

export const buttonVariants = (type: string) => {
  let variantStyle;

  switch (type) {
    case 'primary':
      variantStyle = css`
        path {
          fill: ${globalWhite};
        }
        background-color: ${primary500};
        color: ${globalWhite};

        &:hover {
          background-color: ${primary600};
        }

        &:active {
          background-color: ${primary700};
        }

        &:disabled {
          cursor: not-allowed;
          background-color: ${primary250};
        }
      `;
      break;

    case 'primaryCommon':
      variantStyle = css`
        path {
          fill: ${globalWhite};
        }
        background-color: ${globalGray600};
        color: ${globalWhite};

        &:hover {
          background-color: ${globalGray700};
        }

        &:active {
          background-color: ${globalGray800};
        }

        &:disabled {
          path {
            fill: ${globalGray300};
          }
          cursor: not-allowed;
          background-color: ${globalGray200};
          color: ${globalGray300};
        }
      `;
      break;

    case 'secondary':
      variantStyle = css`
        path {
          fill: ${primary600};
        }
        background-color: ${primary50};
        border: 1px solid ${primary400};
        color: ${primary600};

        &:hover {
          background-color: ${primary100};
        }

        &:active {
          background-color: ${primary200};
        }

        &:disabled {
          path {
            fill: ${primary250};
          }
          cursor: not-allowed;
          border: 1px solid ${primary200};
          color: ${primary250};
        }
      `;
      break;

    case 'secondaryCommon':
      variantStyle = css`
        path {
          fill: ${globalGray700};
        }
        background-color: ${globalWhite};
        border: 1px solid ${globalGray200};
        color: ${globalGray700};

        &:hover {
          background-color: ${globalGray50};
        }

        &:active {
          background-color: ${globalGray100};
        }

        &:disabled {
          path {
            fill: ${globalGray250};
          }
          cursor: not-allowed;
          border: 1px solid ${globalGray150};
          color: ${globalGray250};
        }
      `;
      break;

    case 'assistive':
      variantStyle = css`
        path {
          fill: ${primary600};
        }
        background-color: ${globalWhite};
        border: 1px solid ${globalGray200};
        color: ${primary600};

        &:hover {
          background-color: ${globalGray50};
        }

        &:active {
          background-color: ${globalGray100};
        }

        &:disabled {
          path {
            fill: ${primary250};
          }
          cursor: not-allowed;
          border: 1px solid ${globalGray150};
          color: ${primary250};
        }
      `;
      break;

    case 'assistiveCommon':
      variantStyle = css`
        path {
          fill: ${globalGray400};
        }
        background-color: ${globalWhite};
        border: 1px solid ${globalGray200};
        color: ${globalGray400};

        &:hover {
          background-color: ${globalGray50};
        }

        &:active {
          background-color: ${globalGray100};
        }

        &:disabled {
          path {
            fill: ${globalGray250};
          }
          cursor: not-allowed;
          border: 1px solid ${globalGray150};
          color: ${globalGray250};
        }
      `;
      break;

    default:
      variantStyle = css``; // 기본값 (없음)
      break;
  }

  return variantStyle;
};
