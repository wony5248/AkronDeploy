/**
 * mobile stepper: 1000
 * fab: 1050
 * speed dial: 1050
 * app bar: 1100
 * drawer: 1200
 * modal: 1300
 * snackbar: 1400
 * tooltip: 1500
 */

export const selectionOverlayZIndex = 1405;
// Selection Overlay는 MUI Component SnackBar보다 높고 Dialog나 Menu 보다 낮아야함
// SnackBar: 1400, Dialog: 1450, Menu: 1410
export const menuZIndex = 1410;
// Menu는 SelectionOverlay보다 높고 Dialog보다 낮아야함
// SelectionOverlay: 1405, Dialog: 1450, Menu: 1410
export const dialogZIndex = 1450;
// Dialog는 SelectionOverlay의 z-index보다 높고 ToolTip보단 낮아야함
// SelectionOverlay: 1405 ToolTip: 1500
export const colorPickerZIndex = 1460;
// ColorPicker는 Dialog의 z-index보다 높고 ToolTip보단 낮아야함
// Dialog: 1450 ToolTip: 1500
