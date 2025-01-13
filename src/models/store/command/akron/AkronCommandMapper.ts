import { boundMethod } from 'autobind-decorator';

import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandMapper from 'models/store/command/common/CommandMapper';
import CommandHandlerFactory from 'models/store/command/factory/CommandHandlerFactory';

/**
 * CommandMapper 는 command ID 에 따라 어떤 command handler 들이 동작하는지를 정의한 class 입니다.
 * Command manager 가 command ID 를 받으면 command mapper 에서 command handler list 를 받을 수 있습니다.
 */
class AkronCommandMapper extends CommandMapper {
  /**
   * 생성자
   */
  public constructor(factory: CommandHandlerFactory) {
    super();

    // Widget
    this.setWidgetEditCommandMap(factory);
    this.setWidgetSelectCommandMap(factory);

    // // Widget Layer
    this.setWidgetLayerCommandMap(factory);

    // // Style
    // this.setStyleCommandMap(factory);

    // // Clipboard
    // this.setClipboardCommandMap(factory);

    // Database save
    this.setAppCommandMap(factory);

    // // Mode
    // this.setModeCommandMap(factory);

    // // Page
    this.setPageCommandMap(factory);

    // // Widget template
    // this.setCompositeWidgetCommandMap(factory);

    // // File
    // this.setFileCommandMap(factory);

    // // Paragraph
    // this.setParagraphCommandMap(factory);

    // // Business Logic
    // this.setBusinessLogicCommandMap(factory);

    // // Data
    // this.setDataCommandMap(factory);

    // // Editor Zoom
    // this.setEditorZoomCommandMap(factory);

    // // Page sort
    // this.setPageListSortCommandMap(factory);

    // // Business Dialog Widget
    // this.setBusinessDialogWidgetCommandMap(factory);

    // // External Service
    // this.setExternalServiceCommandMap(factory);

    // // OS Object Component
    // this.setOSCommandMap(factory);

    // // DX Custom SErvice
    // this.setDxCustomServiceCommandMap(factory);

    // // Custom Code
    // this.setCustomCodeMap(factory);

    // this.setLibraryCommandMap(factory);
  }

  /**
   * WidgetEditCommandHandler에서 처리하는
   * CommandEnum을 등록합니다
   */
  @boundMethod
  private setWidgetEditCommandMap(factory: CommandHandlerFactory): void {
    const widgetEditCommandHandler = factory.createWidgetEditCommandHandler();
    // Widget
    this.commandMap.set(CommandEnum.INSERT_WIDGET, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.INSERT_WIDGET_AT, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.INSERT_WIDGET_CLONE, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_WIDGET, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.RENAME_WIDGET, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.WIDGET_MOVE_START, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.WIDGET_MOVE_END, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.WIDGET_MOVE_REACTNODE_PROP, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.WIDGET_UPDATE_PROPERTIES, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.WIDGET_RESIZE_START, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.WIDGET_RESIZE_END, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.HIDE_WIDGET, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.LOCK_WIDGET, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.UPDATE_REPEATABLE_PROPS_DTO_MAP, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_REPEATABLE_PROPS_DTO_MAP, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.UPDATE_CUSTOM_PROPS_VARIABLE_MAP, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_CUSTOM_PROPS_VARIABLE_MAP, [widgetEditCommandHandler]);
    this.commandMap.set(CommandEnum.RESET_WIDGET_CONTENT, [widgetEditCommandHandler]);
  }

  /**
   * WidgetLayerHandler에서 처리하는
   * CommandEnum을 등록합니다
   */
  @boundMethod
  private setWidgetLayerCommandMap(factory: CommandHandlerFactory): void {
    const widgetLayerCommandHandler = factory.createWidgetLayerCommandHandler();
    // Widget Layer
    this.commandMap.set(CommandEnum.LAYER_MOVE, [widgetLayerCommandHandler]);
  }

  /**
   * WidgetSelectHandler에서 처리하는
   * CommandEnum을 등록합니다
   */
  @boundMethod
  private setWidgetSelectCommandMap(factory: CommandHandlerFactory): void {
    const widgetSelectCommandHandler = factory.createWidgetSelectCommandHandler();
    // Widget
    this.commandMap.set(CommandEnum.SELECT_WIDGET, [widgetSelectCommandHandler]);
    this.commandMap.set(CommandEnum.SELECT_PAGE_THUMBNAIL, [widgetSelectCommandHandler]);
    this.commandMap.set(CommandEnum.DRAG_SELECT_WIDGET, [widgetSelectCommandHandler]);
    this.commandMap.set(CommandEnum.SELECT_SECTION, [widgetSelectCommandHandler]);
  }

  /**
   * Style 관련 CommandHandler에서 처리하는
   * CommandEnum을 등록합니다
   */
  @boundMethod
  private setStyleCommandMap(factory: CommandHandlerFactory): void {
    const appStylesCommandHandler = factory.createAppStylesCommandHandler();
    this.commandMap.set(CommandEnum.ADD_APP_STYLES, [appStylesCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_APP_STYLES, [appStylesCommandHandler]);
    this.commandMap.set(CommandEnum.APPLY_APP_STYLES, [appStylesCommandHandler]);
    this.commandMap.set(CommandEnum.UNAPPLY_APP_STYLES, [appStylesCommandHandler]);
  }

  /**
   * Clipboard 관련 CommandEnum을 등록합니다
   */
  @boundMethod
  private setClipboardCommandMap(factory: CommandHandlerFactory): void {
    const clipboardCommandHandler = factory.createClipboardCommandHandler();
    const pageCommandHandler = factory.createPageCommandHandler();
    const widgetEditCommandHandler = factory.createWidgetEditCommandHandler();

    this.commandMap.set(CommandEnum.CLIPBOARD_COPY_PROCESS, [clipboardCommandHandler]);
    this.commandMap.set(CommandEnum.CLIPBOARD_CUT_PROCESS, [
      clipboardCommandHandler,
      widgetEditCommandHandler,
      pageCommandHandler,
    ]);
    this.commandMap.set(CommandEnum.CLIPBOARD_PASTE_PROCESS, [clipboardCommandHandler]);
  }

  /**
   * App의 DB저장 관련 CommandHandler에서 처리하는
   * CommandEnum을 등록합니다
   */
  @boundMethod
  private setAppCommandMap(factory: CommandHandlerFactory): void {
    const appCommandHandler = factory.createAppCommandHandler();
    this.commandMap.set(CommandEnum.SAVE, [appCommandHandler]);
    this.commandMap.set(CommandEnum.SAVE_AS, [appCommandHandler]);
    this.commandMap.set(CommandEnum.ADD_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_ALL_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.EXPAND_ALL_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.COLLAPSE_ALL_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.COLLAPSE_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.RENAME_SECTION, [appCommandHandler]);
    this.commandMap.set(CommandEnum.UPDATE_DEVICE_INFO, [appCommandHandler]);
  }

  //   /**
  //    * Mode 관련 CommandHandler에서 처리하는
  //    * CommandEnum을 등록합니다
  //    */
  //   @boundMethod
  //   private setModeCommandMap(factory: CommandHandlerFactory): void {
  //     const appModeChangeCommandHandler = factory.createAppModeChangeCommandHandler();
  //     this.commandMap.set(CommandEnum.CHANGE_APP_MODE, [appModeChangeCommandHandler]);
  //   }

  /**
   * Page의 조작 관련 CommandHandler에서 처리하는
   * CommandEnum을 등록합니다.
   */
  @boundMethod
  private setPageCommandMap(factory: CommandHandlerFactory): void {
    const pageCommandHandler = factory.createPageCommandHandler();
    // Page
    this.commandMap.set(CommandEnum.ADD_PAGE, [pageCommandHandler]);
    this.commandMap.set(CommandEnum.DELETE_PAGE, [pageCommandHandler]);
    this.commandMap.set(CommandEnum.RENAME_PAGE, [pageCommandHandler]);
    this.commandMap.set(CommandEnum.SELECT_PAGE_BY_ID, [pageCommandHandler]);
    this.commandMap.set(CommandEnum.LOCK_PAGE, [pageCommandHandler]);
    this.commandMap.set(CommandEnum.HIDE_PAGE, [pageCommandHandler]);
    this.commandMap.set(CommandEnum.UPDATE_PAGE_LEVEL, [pageCommandHandler]);
  }

  //   /**
  //    * Composite widget 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setCompositeWidgetCommandMap(factory: CommandHandlerFactory): void {
  //     const widgetTemplateCommandHandler = factory.createCompositeWidgetCommandHandler();
  //     this.commandMap.set(CommandEnum.REGISTER_COMPOSITE_WIDGET, [widgetTemplateCommandHandler]);
  //     this.commandMap.set(CommandEnum.UNREGISTER_COMPOSITE_WIDGET, [widgetTemplateCommandHandler]);
  //     // this.commandMap.set(CommandEnum.REGISTER_COMPOSITE_WIDGET, [widgetTemplateCommandHandler]);
  //     // this.commandMap.set(CommandEnum.UNREGISTER_COMPOSITE_WIDGET, [widgetTemplateCommandHandler]);
  //   }

  //   /**
  //    * File 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setFileCommandMap(factory: CommandHandlerFactory): void {
  //     const fileCommandHandler = factory.createFileCommandHandler();
  //     this.commandMap.set(CommandEnum.INSERT_FILE, [fileCommandHandler]);
  //   }

  //   /**
  //    * Paragraph 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setParagraphCommandMap(factory: CommandHandlerFactory): void {
  //     const paragraphCommandHandler = factory.createParagraphCommandHandler();
  //     this.commandMap.set(CommandEnum.UPDATE_TEXT, [paragraphCommandHandler]);
  //   }

  //   /**
  //    * Business Logic 관련 CommandEnum을 등록합니다.
  //    */
  //   private setBusinessLogicCommandMap(factory: CommandHandlerFactory): void {
  //     const businessLogicCommandHandler = factory.creatBusinessLogicCommandHandler();
  //     this.commandMap.set(CommandEnum.INSERT_BUSINESS_LOGIC, [businessLogicCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_BUSINESS_LOGIC, [businessLogicCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_BUSINESS_LOGIC, [businessLogicCommandHandler]);
  //     this.commandMap.set(CommandEnum.EXECUTE_BUSINESS_LOGIC, [businessLogicCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_CALLBACK, [businessLogicCommandHandler]);
  //   }

  //   /**
  //    * Data 관련 CommandEnum을 등록합니다.
  //    */
  //   private setDataCommandMap(factory: CommandHandlerFactory): void {
  //     const dataCommandHandler = factory.createDataCommandHandler();
  //     this.commandMap.set(CommandEnum.INSERT_VARIABLE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_VARIABLE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_VARIABLE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.APPLY_VARIABLE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.CHANGE_APPLY_VARIABLE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.CANCEL_APPLY_VARIABLE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_COMPOSITE_WIDGET_PROPERTIES, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_COMPOSITE_WIDGET_STATE, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.CREATE_AND_BIND_COMPOSITE_WIDGET_PROPERTIES, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.CREATE_AND_BIND_COMPOSITE_WIDGET_STATES, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_WIDGET_PROPS_STATES, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.APPLY_WIDGET_PROPS_STATES, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.INSERT_PUBLISH_CUSTOM_PROPERTIES_STATES, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.INSERT_PUBLISH_DATA_STORE_DATA, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.INSERT_VARIABLE_DATA_TYPE, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_VARIABLE_DATA_TYPE, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_VARIABLE_DATA_TYPE, [dataCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_VARIABLE_DATA_TYPE_REF, [dataCommandHandler]);
  //   }

  /**
   * Editor Zoom 관련 CommandEnum을 등록합니다.
   */
  private setEditorZoomCommandMap(factory: CommandHandlerFactory): void {
    const editorZoomInOutCommandHandler = factory.createEditorZoomInOutCommandHandler();
    this.commandMap.set(CommandEnum.ZOOM_IN, [editorZoomInOutCommandHandler]);
    this.commandMap.set(CommandEnum.ZOOM_OUT, [editorZoomInOutCommandHandler]);
    this.commandMap.set(CommandEnum.ZOOM_RATIO, [editorZoomInOutCommandHandler]);
    this.commandMap.set(CommandEnum.FIT_WINDOW, [editorZoomInOutCommandHandler]);
    this.commandMap.set(CommandEnum.ZOOM_IN_CTRL, [editorZoomInOutCommandHandler]);
    this.commandMap.set(CommandEnum.ZOOM_OUT_CTRL, [editorZoomInOutCommandHandler]);
  }

  /**
   * page sort 관련 CommandEnum을 등록합니다.
   */
  private setPageListSortCommandMap(factory: CommandHandlerFactory): void {
    const pageListSortCommandHandler = factory.createPageListSortCommandHandler();
    this.commandMap.set(CommandEnum.MOVE_PAGE_THUMBNAIL, [pageListSortCommandHandler]);
    this.commandMap.set(CommandEnum.MOVE_PAGE_THUMBNAIL_IN_SECTION, [pageListSortCommandHandler]);
    this.commandMap.set(CommandEnum.MOVE_SECTION, [pageListSortCommandHandler]);
  }

  //   /**
  //    * BusinessDialog widget 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setBusinessDialogWidgetCommandMap(factory: CommandHandlerFactory): void {
  //     const businessDialogComponentCommandHandler = factory.createBusinessDialogWidgetWidgetCommandHandler();
  //     this.commandMap.set(CommandEnum.REGISTER_BUSINESS_DIALOG_WIDGET, [businessDialogComponentCommandHandler]);
  //     this.commandMap.set(CommandEnum.UNREGISTER_BUSINESS_DIALOG_WIDGET, [businessDialogComponentCommandHandler]);
  //   }

  //   /**
  //    * External Service 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setExternalServiceCommandMap(factory: CommandHandlerFactory): void {
  //     const externalServiceCommandHandler = factory.createExternalCommandHandler();
  //     this.commandMap.set(CommandEnum.CREATE_EXTERNAL_SERVICE_SERVER, [externalServiceCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_EXTERNAL_SERVICE_SERVER, [externalServiceCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_EXTERNAL_SERVICE_SERVER, [externalServiceCommandHandler]);
  //     this.commandMap.set(CommandEnum.CREATE_EXTERNAL_SERVICE, [externalServiceCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_EXTERNAL_SERVICE, [externalServiceCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_EXTERNAL_SERVICE, [externalServiceCommandHandler]);
  //   }

  //   /**
  //    * OS Object 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setOSCommandMap(factory: CommandHandlerFactory): void {
  //     const OSCommandHandler = factory.createOSCommandHandler();
  //     this.commandMap.set(CommandEnum.UPDATE_OS_OBJECT, [OSCommandHandler]);
  //     this.commandMap.set(CommandEnum.ADD_OS_OBJECT, [OSCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_OS_OBJECT, [OSCommandHandler]);
  //   }

  //   /**
  //    * DX Custom Service 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setDxCustomServiceCommandMap(factory: CommandHandlerFactory): void {
  //     const dxCustomServiceCommandHandler = factory.createDxCustomServiceCommandHandler();
  //     this.commandMap.set(CommandEnum.CREATE_DX_CUSTOM_SERVICE, [dxCustomServiceCommandHandler]);
  //     this.commandMap.set(CommandEnum.CREATE_DX_CUSTOM_SERVICE_DTO, [dxCustomServiceCommandHandler]);
  //   }

  //   /**
  //    * Custom Code 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setCustomCodeMap(factory: CommandHandlerFactory): void {
  //     const customCodeCommandHandler = factory.createCustomCodeCommandHandler();
  //     this.commandMap.set(CommandEnum.INSERT_CUSTOM_CODE_DATA, [customCodeCommandHandler]);
  //     this.commandMap.set(CommandEnum.DELETE_CUSTOM_CODE_DATA, [customCodeCommandHandler]);
  //     this.commandMap.set(CommandEnum.UPDATE_CUSTOM_CODE_DATA, [customCodeCommandHandler]);
  //   }

  //   /**
  //    * Custom Code 관련 CommandEnum을 등록합니다.
  //    */
  //   @boundMethod
  //   private setLibraryCommandMap(factory: CommandHandlerFactory): void {
  //     const libraryCommandHandler = factory.createLibraryCommandHandler();
  //     this.commandMap.set(CommandEnum.INSERT_TEMPLATE, [libraryCommandHandler]);
  //   }
}

export default AkronCommandMapper;
