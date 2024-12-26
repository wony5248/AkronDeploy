import { css } from '@emotion/react';
import { primaryColor500, white } from 'styles/Color';
import { selectionOverlayZIndex } from 'styles/MUIZIndex';

export const widgetSelectionView = (pageLocked: boolean) => css`
  position: absolute;
  box-sizing: border-box;
  cursor: move;

  pointer-events: ${pageLocked ? 'none' : undefined};
  cursor: ${pageLocked ? 'auto' : undefined};
`;

export const widgetSelectionViewHandleSquare = css`
  height: 6px;
  width: 6px;
  display: inline-block;
  position: absolute;
  background-color: ${white};
  outline: solid 1px ${primaryColor500};
  z-index: 2000;
`;

export const widgetSelectionOverlay = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: ${selectionOverlayZIndex} !important;

  // Selection Overlay는 MUI Component SnackBar보다 높고 Dialog나 Menu 보다 낮아야 함
  // SnackBar: 1400, Dialog: 1450, Menu: 1410
  margin: 0;
  padding: 0;
`;
