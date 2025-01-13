/**
 * widget model 의 element type
 * 서버와의 통신 시 message에 명시하기 위한 용도로 사용
 */
export enum ContentType {
  INVALID = 0,
  COMPONENT_APP,
  COMPONENT,
  COMPONENT_PAGE,
  COMPONENT_CONTENT,
  COMPONENT_STYLE,
  APP_STYLES,
}

/**
 * object type
 * 서버와의 통신 시 message에 명시하기 위한 용도로 사용
 */
export enum ObjectType {
  DEFAULT = 0,
}

export const basicHtmlWidgetTypeNames = [
  'BasicLabel',
  'BasicParagraph',
  'BasicColor',
  'BasicDate',
  'BasicDivision',
  'BasicImage',
  'BasicVideo',
  'BasicOnlineImage',
  'BasicOnlineVideo',
  'BasicMap',
  'BasicLinearProgress',
  'BasicImageGallery',
  'BasicOption',
] as const;

export const basicMuiWidgetTypeNames = [
  // 주석 처리된 컴포넌트는 리본 가이드 반영에 따라 동작 확인 후 추가
  // MUI 컴포넌트
  // INPUTS
  'BasicAutoComplete',
  'BasicButton',
  'BasicIconButton',
  'BasicLoadingButton',
  'BasicButtonGroup',
  'BasicCheckbox',
  'BasicFloatingActionButton',
  'BasicRadio',
  'BasicRadioGroup',
  'BasicRating',
  'BasicNativeSelect',
  'BasicSelect',
  'BasicSlider',
  'BasicSwitch',
  'BasicTextField',
  'BasicToggleButton',
  'BasicToggleButtonGroup',
  // ...
  // DATA DISPLAY
  'BasicAvatar',
  'BasicAvatarGroup',
  'BasicBadge',
  'BasicChip',
  'BasicDivider',
  'BasicIcon',
  'BasicList',
  'BasicListItem',
  'BasicListItemAvatar',
  'BasicListItemButton',
  'BasicListItemIcon',
  'BasicListItemSecondaryAction',
  'BasicListItemText',
  'BasicListSubheader',
  'BasicTable',
  'BasicTableBody',
  'BasicTableCell',
  'BasicTableContainer',
  'BasicTableFooter',
  'BasicTableHead',
  'BasicTablePagination',
  'BasicTableRow',
  'BasicTableSortLabel',
  'BasicTooltip',
  'BasicTypography',
  // ...
  // FEEDBACK
  'BasicAlert',
  'BasicAlertTitle',
  'BasicBackdrop',
  'BasicDialog',
  'BasicDialogActions',
  'BasicDialogContent',
  'BasicDialogContentText',
  'BasicDialogTitle',
  'BasicCircularProgress',
  'BasicSnackbar',
  'BasicSnackbarContent',
  'BasicSkeleton',
  // SURFACES
  'BasicPaper',
  'BasicAccordion',
  'BasicAccordionActions',
  'BasicAccordionDetails',
  'BasicAccordionSummary',
  'BasicAppBar',
  'BasicToolbar',
  'BasicCard',
  'BasicCardActionArea',
  'BasicCardActions',
  'BasicCardContent',
  'BasicCardHeader',
  'BasicCardMedia',
  // ...
  // NAVIGATION
  'BasicBottomNavigation',
  'BasicBottomNavigationAction',
  'BasicBreadcrumbs',
  'BasicLink',
  'BasicDrawer',
  'BasicSwipeableDrawer',
  'BasicClickAwayListener',
  'BasicMenu',
  'BasicMenuItem',
  'BasicMenuList',
  'BasicPopover',
  'BasicPopper',
  'BasicSpeedDial',
  'BasicSpeedDialAction',
  'BasicSpeedDialIcon',
  'BasicPagination',
  'BasicPaginationItem',
  'BasicMobileStepper',
  'BasicStep',
  'BasicStepButton',
  'BasicStepConnector',
  'BasicStepContent',
  'BasicStepIcon',
  'BasicStepLabel',
  'BasicStepper',
  'BasicTab',
  'BasicTabContext',
  'BasicTabList',
  'BasicTabPanel',
  'BasicTabScrollButton',
  'BasicTabs',
  // LAYOUT
  'BasicBox',
  'BasicContainer',
  'BasicGrid',
  'BasicStack',
  'BasicImageList',
  'BasicImageListItem',
  'BasicImageListItemBar',
  // DATE & TIME PICKER
  'BasicCalendarPicker',
  'BasicCalendarPickerSkeleton',
  'BasicClockPicker',
  'BasicDatePicker',
  'BasicDateTimePicker',
  'BasicDesktopDatePicker',
  'BasicDesktopDateTimePicker',
  'BasicDesktopTimePicker',
  'BasicMobileDatePicker',
  'BasicMobileDateTimePicker',
  'BasicMobileTimePicker',
  'BasicMonthPicker',
  'BasicPickersDay',
  'BasicStaticDatePicker',
  'BasicStaticDateTimePicker',
  'BasicStaticTimePicker',
  'BasicTimePicker',
  'BasicYearPicker',
] as const;

/**
 * Layout Widget의 종류 = 'LayoutHorizontalFrame' | 'LayoutVerticalFrame' |
 */

export const layoutWidgetTypeNames: readonly string[] = [
  'LayoutHorizontalFrame',
  'LayoutVerticalFrame',
  'RepeatableLayout',
  'InfiniteLayout',
  'ConditionalLayout',
  'ScreenLayout',
  'InnerPageLayout',
  'FragmentLayout',
] as const;

export const userCreatedWidgetTypeNames: string[] = [];
/**
 * UserCreated widget의 종류
 */
export type UserCreatedWidgetType = (typeof userCreatedWidgetTypeNames)[number];
export const basicWidgetTypeNames = [...basicHtmlWidgetTypeNames, ...basicMuiWidgetTypeNames] as const;
export const specialWidgetTypeNames = ['App', 'Page', 'BusinessDialog'] as const;

/**
 * Special widget의 종류 = 'App' | 'Page' | ...
 */
export type SpecialWidgetType = (typeof specialWidgetTypeNames)[number];
export type LayoutWidgetType = (typeof layoutWidgetTypeNames)[number];
export type BasicWidgetType = (typeof basicWidgetTypeNames)[number];
