import { css } from '@emotion/react';
import { grayColor400, grayColor800 } from 'styles/Color';

export const toolPaneDockButton = css`
  position: relative;
  cursor: pointer;
  font-size: 11px;
  width: auto;
  height: 16px;
  line-height: 16px;
  border: 0;
  color: ${grayColor400};
  border-color: transparent;
  background-color: transparent;
  font-weight: 400;

  &.isActive {
    color: ${grayColor800};
    font-weight: 700;
  }

  &:hover {
    /* hover 상태의 스타일이 주석처리 되어있음 */
    /* background-color: Colors.$uxPrimaryColorFillEnabled; */
  }

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
