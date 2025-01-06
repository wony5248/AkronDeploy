enum CommandEnum {
  INVALID,

  UNDO,
  REDO,
  CHANGE_APP_MODE,
  ZOOM_IN,
  ZOOM_OUT,
  ZOOM_RATIO,
  FIT_WINDOW,
  ZOOM_IN_CTRL,
  ZOOM_OUT_CTRL,

  // widget
  INSERT_WIDGET,
  INSERT_WIDGET_AT,
  INSERT_WIDGET_CLONE,
  DELETE_WIDGET,
  RENAME_WIDGET,
  SELECT_WIDGET,
  DRAG_SELECT_WIDGET,
  SELECT_PAGE_THUMBNAIL,
  WIDGET_MOVE_START,
  WIDGET_MOVE_END,
  WIDGET_MOVE_REACTNODE_PROP,
  WIDGET_UPDATE_PROPERTIES,
  WIDGET_RESIZE_START,
  WIDGET_RESIZE_END,
  HIDE_WIDGET,
  LOCK_WIDGET,
  UPDATE_REPEATABLE_PROPS_DTO_MAP,
  DELETE_REPEATABLE_PROPS_DTO_MAP,
  UPDATE_CUSTOM_PROPS_VARIABLE_MAP,
  DELETE_CUSTOM_PROPS_VARIABLE_MAP,
  UPDATE_WIDGET_PROPS_STATES,
  APPLY_WIDGET_PROPS_STATES,
  RESET_WIDGET_CONTENT,
  WIDGET_UPDATE_SUB_COMPONENT_COUNT,
  INSERT_CONDITIONAL_LAYOUT_FRAME,
  DELETE_CONDITIONAL_LAYOUT_FRAME,
  UPDATE_CONDITIONAL_LAYOUT_FRAME,
  SET_INFO_FOR_INSERT_DRAG_WIDGET,
  UPDATE_SIZE,
  UPDATE_POSITION,

  // widget layer
  LAYER_MOVE,

  // composite widget
  REGISTER_COMPOSITE_WIDGET,
  UNREGISTER_COMPOSITE_WIDGET,

  // device
  UPDATE_DEVICE_INFO,

  // page
  ADD_PAGE,
  DELETE_PAGE,
  RENAME_PAGE,
  SELECT_PAGE_BY_ID,
  LOCK_PAGE,
  HIDE_PAGE,
  UPDATE_PAGE_LEVEL,

  // style
  ADD_APP_STYLES,
  DELETE_APP_STYLES,
  APPLY_APP_STYLES,
  UNAPPLY_APP_STYLES,

  // clipboard
  CLIPBOARD_COPY_PROCESS,
  CLIPBOARD_CUT_PROCESS,
  CLIPBOARD_PASTE_PROCESS,

  // save
  OPEN,
  OPEN_NEW_PROJECT,
  SAVE,
  SAVE_AS,

  // file
  INSERT_FILE,

  // paragraph
  UPDATE_TEXT,

  // section
  ADD_SECTION,
  DELETE_SECTION,
  DELETE_ALL_SECTION,
  EXPAND_ALL_SECTION,
  COLLAPSE_ALL_SECTION,
  COLLAPSE_SECTION,
  RENAME_SECTION,
  SELECT_SECTION,

  // OS object
  ADD_OS_OBJECT,
  DELETE_OS_OBJECT,
  UPDATE_OS_OBJECT,

  // Data Store
  INSERT_VARIABLE_DATA,
  UPDATE_VARIABLE_DATA,
  DELETE_VARIABLE_DATA,
  APPLY_VARIABLE_DATA,
  CHANGE_APPLY_VARIABLE_DATA,
  CANCEL_APPLY_VARIABLE_DATA,
  UPDATE_COMPOSITE_WIDGET_PROPERTIES,
  UPDATE_COMPOSITE_WIDGET_STATE,
  CREATE_AND_BIND_COMPOSITE_WIDGET_PROPERTIES,
  CREATE_AND_BIND_COMPOSITE_WIDGET_STATES,
  UPDATE_BUSINESS_ARGUTMENT,
  UPDATE_BUSINESS_DTO,
  INSERT_PUBLISH_CUSTOM_PROPERTIES_STATES,
  INSERT_PUBLISH_DATA_STORE_DATA,
  INSERT_VARIABLE_DATA_TYPE,
  UPDATE_VARIABLE_DATA_TYPE,
  DELETE_VARIABLE_DATA_TYPE,
  UPDATE_VARIABLE_DATA_TYPE_REF,

  // page list sort
  MOVE_PAGE_THUMBNAIL,
  MOVE_PAGE_THUMBNAIL_IN_SECTION,
  MOVE_SECTION,

  // register Business Dialog Widget
  REGISTER_BUSINESS_DIALOG_WIDGET,
  UNREGISTER_BUSINESS_DIALOG_WIDGET,

  // Service Component
  CREATE_SERVICE_COMPONENT, // TODO: DX 연동 후 제거하기
  DELETE_SERVICE_COMPONENT,

  CREATE_SERVICE_DTO,
  UPDATE_SERVICE_DTO,
  DELETE_SERVICE_DTO,

  CREATE_SERVICE_DTO_ATTR,
  UPDATE_SERVICE_DTO_ATTR,
  DELETE_SERVICE_DTO_ATTR,

  REQUEST_SERVICE_COMPONENT,

  // External Service
  CREATE_EXTERNAL_SERVICE_SERVER,
  UPDATE_EXTERNAL_SERVICE_SERVER,
  DELETE_EXTERNAL_SERVICE_SERVER,

  CREATE_EXTERNAL_SERVICE,
  UPDATE_EXTERNAL_SERVICE,
  DELETE_EXTERNAL_SERVICE,

  CREATE_EXTERNAL_SERVICE_DTO,
  UPDATE_EXTERNAL_SERVICE_DTO,
  DELETE_EXTERNAL_SERVICE_DTO,

  CREATE_EXTERNAL_SERVICE_DTO_ATTR,
  UPDATE_EXTERNAL_SERVICE_DTO_ATTR,
  DELETE_EXTERNAL_SERVICE_DTO_ATTR,

  // Business Component Chain
  INSERT_BUSINESS_LOGIC,
  UPDATE_BUSINESS_LOGIC,
  DELETE_BUSINESS_LOGIC,
  EXECUTE_BUSINESS_LOGIC,
  DELETE_CALLBACK,

  // DX Custom Service
  CREATE_DX_CUSTOM_SERVICE,
  CREATE_DX_CUSTOM_SERVICE_DTO,

  // Custom Code Logic
  INSERT_CUSTOM_CODE_DATA,
  DELETE_CUSTOM_CODE_DATA,
  UPDATE_CUSTOM_CODE_DATA,

  // Libray Command
  INSERT_TEMPLATE,
}

export default CommandEnum;
