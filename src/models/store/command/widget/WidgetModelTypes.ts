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

/**
 * Layout Widget의 종류 = 'LayoutHorizontalFrame' | 'LayoutVerticalFrame' |
 */
export type LayoutWidgetType = (typeof layoutWidgetTypeNames)[number];

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
