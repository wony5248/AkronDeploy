import { css } from '@emotion/react';

export const tooltipWrapper = css`
  position: fixed;
  width: fit-content;
  z-index: 1500;
`;

export const tooltip = (
  position: 'bottomCenter' | 'topCenter' | 'left' | 'right' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
) => css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 10px;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 12px;
  color: #ffffff;
  background-color: #101728;
  user-select: text;
  position: relative;

  ::selection {
    background-color: #e7deff;
    color: #000000;
  }

  p {
    margin: 0;
  }

  &::after {
    content: '';
    position: absolute;
    border-style: solid;
    border-width: 4px;

    ${position === 'bottomCenter' &&
    css`
      top: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      border-color: #101728 transparent transparent;
    `}

    ${position === 'topCenter' &&
    css`
      bottom: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      border-color: transparent transparent #101728;
    `}

    ${position === 'left' &&
    css`
      top: 50%;
      left: 100%;
      transform: translate(0, -50%);
      border-color: transparent transparent transparent #101728;
    `}

    ${position === 'right' &&
    css`
      top: 50%;
      right: 100%;
      transform: translate(0, -50%);
      border-color: transparent #101728 transparent transparent;
    `}

    ${position === 'bottomRight' &&
    css`
      top: 100%;
      right: 70%; /* $temporaryPercent 대체 */
      transform: translate(-50%, 0);
      border-color: #101728 transparent transparent;
    `}

    ${position === 'bottomLeft' &&
    css`
      top: 100%;
      left: 70%; /* $temporaryPercent 대체 */
      transform: translate(-50%, 0);
      border-color: #101728 transparent transparent;
    `}

    ${position === 'topRight' &&
    css`
      bottom: 100%;
      right: 70%; /* $temporaryPercent 대체 */
      transform: translate(-50%, 0);
      border-color: transparent transparent #101728;
    `}

    ${position === 'topLeft' &&
    css`
      bottom: 100%;
      left: 70%; /* $temporaryPercent 대체 */
      transform: translate(-50%, 0);
      border-color: transparent transparent #101728;
    `}
  }
`;

export const title = css`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  font-size: 12px;

  i {
    line-height: 14.52px;
  }
`;

export const titleBorder = css`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 3px;
  padding-bottom: 3px;
  border-bottom: 1px solid #ffffff;

  i {
    line-height: 12px;
  }
`;

export const link = css`
  color: rgb(106, 139, 255);
`;
