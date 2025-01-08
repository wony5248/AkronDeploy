/**
 * widget model 의 element type
 * 서버와의 통신 시 message에 명시하기 위한 용도로 사용
 */
export enum ContentType {
  INVALID = 0,
  APP_STYLES,
  BUSINESS_ARGUMENT_DATA,
  BX_MAPPING,
  CALLBACK,
  CMS_EVENT_HANDLER,
  COMPONENT,
  COMPONENT_APP,
  COMPONENT_COMPOSITE,
  COMPONENT_CUSTOM,
  COMPONENT_CUSTOM_PROPS,
  COMPONENT_EVENT_TYPE,
  COMPONENT_PAGE,
  COMPONENT_PUBLISHED,
  COMPONENT_PUBLISHED_PROPS,
  COMPONENT_STUDIO,
  COMPONENT_STUDIO_PROPS,
  COMPONENT_SYSTEM,
  COMPONENT_SYSTEM_PROPS,
  COMPONENT_WORK_AREA,
  CUSTOM_CODE_DATA,
  CUSTOM_PROPS_VARIABLE_MAP,
  DEVICE_INFO,
  EVENT_CHAIN,
  EVENT_HANDLER,
  OUTER_SERVICE,
  OUTER_SERVICE_DTO,
  OUTER_SERVICE_DTO_ATTR,
  OUTER_SERVICE_SERVER,
  INSERTED_COMPONENT_LIBRARY,
  INSERTED_TEMPLATE_LIBRARY,
  OBJECT_TYPE,
  OS_OBJECT,
  REMOTE_COMPONENT_PROPERTIES,
  SERVICE,
  SERVICE_HANDLER,
  SHELL_SERVICE,
  SHELL_SERVICE_HANDLER,
  THEME,
  APPLIED_THEME,
  COMPONENT_THEME_PROP,
  UX_COMPONENT_PUBLISHED_PROPS,
  CUSTOM_FUNCTION,
  VARIABLE_DATA,
  FILE_COMPONENT_RELATION,
  PMX_COMPONENT,
  UX_SECTION,
}

/**
 * object type
 * 서버와의 통신 시 message에 명시하기 위한 용도로 사용
 */
export enum ObjectType {
  DEFAULT = 0,
}

export enum WidgetEditingState {
  NONE,
  RESIZE,
  MOVE, // 이동을 시작한 원본 widget(이동 중에 움직이지 않음)
  FLOATING, // 이동을 시작한 widget으로부터 clone된 floating widget
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
export type IWidgetPartofProperties = { style?: { [key: string]: any }; content?: { [key: string]: any } };
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

export type AnyWidgetType = BasicWidgetType | SpecialWidgetType | LayoutWidgetType | UserCreatedWidgetType;
export type InsertableWidgetType = Exclude<AnyWidgetType, 'FragmentLayout'>;

export const staticWidgetTypes = new Set<AnyWidgetType>(['App']);
