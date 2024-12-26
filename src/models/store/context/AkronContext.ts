import { Nullable } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import AppModel from 'models/node/AppModel';
import { WidgetID } from 'models/node/WidgetModel';
import Command from 'models/store/command/common/Command';
import WidgetCommandProps from 'models/store/command/common/WidgetCommandProps';
import SelectionContainer from 'models/store/container/SelectionContainer';
import {
  ContextBaseInitializeProp,
  ReadOnlyContextBaseProp,
  ContextInitializeProp,
  EditableContextProp,
} from 'models/store/context/ContextTypes';
import EditableContext from 'models/store/context/EditableContext';
import { NavigateFunction } from 'react-router-dom';

/**
 * DocumentStore 에서 관리하는 context 구조입니다.
 */
export default class AkronContext {
  /**
   * ReadOnlyContext 정보
   */
  // private appReadOnlyContext: ReadOnlyContext;

  /**
   * EditableContext 정보
   */
  private appEditableContext: EditableContext;

  /**
   * 생성자
   */
  constructor(initProp: ContextInitializeProp) {
    // read only context
    // this.appReadOnlyContext = new ReadOnlyContextBase(this.getReadOnlyContextProp(initProp));

    // editable context
    this.appEditableContext = new EditableContext(this.getEditableContextProp(initProp));
  }

  /**
   * AppContext / AppContextBase 의 공통 interface를 구성하기 위하여 임의로 추가한 method
   */
  public doNotImplementThisFunctionExceptAppContext() {
    // an empty function
  }

  /**
   * AppContextBaseInitilizeProp을 기반으로 ReadOnlyContext의 생성자 prop을 생성해 반환합니다
   * FIXME: 임시로 몇 가지 넣어뒀으나, EditableContext에서 분리해 해당 Context로 추가하는 작업이 필요합니다
   */
  @boundMethod
  public getReadOnlyContextProp(initProp: ContextBaseInitializeProp): ReadOnlyContextBaseProp {
    return {
      appID: initProp.appID,
    };
  }

  /**
   * AppContextBaseInitilizeProp을 기반으로 EditableContext의 생성자 prop을 생성해 반환합니다
   */
  @boundMethod
  public getEditableContextProp(initProp: ContextInitializeProp): EditableContextProp {
    return {
      newAppModel: initProp.newAppModel,
      appID: initProp.appID,
      // appInfo: initProp.appInfo,
      // newMetaDataContainer: initProp.newMetaDataContainer,
      // appStylesContainer: this.createAppStylesContainer(initProp.appInfo.globalCSSs),
      // appStylesContainer: this.createAppStylesContainer(),
      // businessContainer: initProp.businessContainer,
      // newBusinessContainer: initProp.newBusinessContainer,
      // dataStore: initProp.dataStore,
      // serviceStore: initProp.serviceStore,
      // customFunctionStore: initProp.customFunctionStore,
      // serviceHandlerStore: initProp.serviceHandlerStore,
      // dataBindingContainer: initProp.dataBindingContainer,
      // globalThemeContainer: initProp.globalThemeContainer,
      // compThemeContainer: initProp.compThemeContainer,
      // compositeComponentContainer: initProp.compositeComponentContainer,
      // newOSObjectContainer: initProp.newOSObjectContainer,
      // outerServiceStore: initProp.outerServiceStore,
      // highLevelStudiosContainer: initProp.highLevelStudiosContainer,
      // uiStore: this.createUIStore(),
      // businessComponentServiceMapper: this.createBusinessComponentServiceMapper(),
      eventState: initProp.eventState,
      appName: initProp.appName,
      appModeContainer: initProp.appModeContainer,
      // roomList: this.createRoomList(),
      // needSaveState: this.createNeedSaveState(),
      // commandProps: this.createCommandProps(),
      // commandController: this.createCommand(),
      // commandMode: this.createCommandMode(),
      // saveState: this.createSaveState(),
      // fileSaveState: this.createFileSaveState(),
      // zoomRatio: this.createZoomRatio(),
      // previewZoomRatio: this.createPreviewZoomRatio(),
      // pageScroll: this.createPageScroll(),
      // isFitWindow: this.createIsFitWindow(),
      // dragObject: this.createDragObject(),
      // mouseMode: this.createMouseMode(),
      // contextMenu: this.createContextMenu(),
      // saved: this.createSaved(),
      // dialogType: this.createDialogType(),
      // dialogOpen: this.createDialogOpen(),
      // undoStack: this.createUndoStack(),
      // lastRegisteredEditUndoStackTag: this.createLastRegisteredEditUndoStackTag(),
      // hitContainer: this.createHitContainer(),
      // selectionContainer: this.createSelectionContainer(),
      // clipboardContainer: this.createClipboardContainer(),
      // propContainer: this.createPropContainer(),
      // widgetEditInfoContainer: this.createWidgetEditInfoContainer(),
      // errorBoundaryContainer: this.createErrorBoundaryContainer(),
      // smartGuideContainer: this.createSmartGuideContainer(),
      // updateMessageContainer: this.createUpdateMessageContainer(),
      // pageContainer: this.createPageContainer({
      //   startPageID: initProp.startPageID,
      //   startPageURL: initProp.startPageURL,
      // }),
      // editorUIStore: this.createEditorUIStore(
      //   initProp.customPropertyContentRenderer,
      //   initProp.activeLeftToolPaneType,
      //   // 하이레벨 스튜디오의 경우 요소 추가 부분이 열린 상태로 시작.
      //   initProp.appModeContainer.isHighLevelStudio() ? 'ADD_WIDGET' : undefined
      // ),
      contextMenuContainer: initProp.contextMenuContainer,
      // fileMessageContainer: this.createFileMessageContainer(),
      // fileContainer: initProp.fileContainer,
      // libraryContainer: initProp.libraryContainer,
      // widgetHandToolContainer: this.createWidgetHandToolContainer(),
    } as EditableContextProp;
  }

  /**
   * BusinessComponentServiceMapper를 생성해 반환합니다
   */
  // @boundMethod
  // public createBusinessComponentServiceMapper(): BusinessComponentServiceMapper {
  //   return new BusinessComponentServiceMapper(new BusinessComponentRuntimeServiceFactory());
  // }

  /**
   * UIStore를 생성해 반환합니다
   */
  // @boundMethod
  // public createUIStore(): UIStore {
  //   return new UIStore();
  // }

  /**
   * AppStylesContainer를 생성해 반환합니다
   */
  // @boundMethod
  // public createAppStylesContainer(globalCsss?: [string, CSSInfo][]): AppStylesContainer {
  //   const appStylesContainer = new AppStylesContainer();
  //   appStylesContainer.setAllGlobalCSSs(globalCsss ?? []);
  //   return appStylesContainer;
  // }

  /**
   * AppID를 반환합니다
   */
  // @boundMethod
  // public getAppID(): WidgetID {
  //   return this.appReadOnlyContext.getAppID();
  // }

  /**
   * AppType을 반환합니다
   */
  // @boundMethod
  // public getAppType(): AppType {
  //   return this.appReadOnlyContext.getAppType();
  // }

  /**
   * AppWidgetModel을 반환합니다
   */
  @boundMethod
  public getNewAppModel(): AppModel {
    return this.appEditableContext.getNewAppModel();
  }

  /**
   * AppWidgetModel을 설정합니다
   */
  @boundMethod
  public setAppWidgetModel(appModel: AppModel): void {
    this.appEditableContext.setNewAppModel(appModel);
  }

  /**
   * AppID를 설정합니다
   */
  @boundMethod
  public setAppID(appID: WidgetID): void {
    this.appEditableContext.setAppID(appID);
  }

  /**
   * DocumentContext
   * CommandProps를 반환합니다
   */
  @boundMethod
  public getCommandProps(): WidgetCommandProps | undefined {
    return this.appEditableContext.getCommandProps();
  }

  /**
   * DocumentContext
   * CommandProps를 설정합니다
   */
  @boundMethod
  public setCommandProps(commandProps: WidgetCommandProps | undefined): void {
    this.appEditableContext.setCommandProps(commandProps);
  }

  /**
   * DocumentContext
   * Command를 반환합니다
   */
  @boundMethod
  public getCommand(): Command | undefined {
    return this.appEditableContext.getCommand();
  }

  /**
   * DocumentContext
   * Command를 설정합니다
   */
  @boundMethod
  public setCommand(command: Command | undefined): void {
    this.appEditableContext.setCommand(command);
  }

  /**
   * DocumentContext
   * SelectionContainer을 반환합니다
   */
  @boundMethod
  public getSelectionContainer(): SelectionContainer {
    return this.appEditableContext.getSelectionContainer();
  }

  /**
   * AppInfo를 반환합니다
   */
  // @boundMethod
  // public getAppInfo(): AppInfo {
  //   return this.appEditableContext.getAppInfo();
  // }

  /**
   * AppInfo를 설정합니다
   */
  // @boundMethod
  // public setAppInfo(appInfo: AppInfo): void {
  //   this.appEditableContext.setAppInfo(appInfo);
  // }

  /**
   * newMetaDataContainer를 반환합니다
   */
  // @boundMethod
  // public getNewMetaDataContainer(): NewMetaDataContainer {
  //   return this.appEditableContext.getNewMetaDataContainer();
  // }

  // /**
  //  * newMetaDataContainer를 설정합니다
  //  */
  // @boundMethod
  // public setNewMetaDataContainer(newMetaDataContainer: NewMetaDataContainer): void {
  //   this.appEditableContext.setNewMetaDataContainer(newMetaDataContainer);
  // }

  // /**
  //  * AppStylesContainer를 반환합니다
  //  */
  // @boundMethod
  // public getAppStylesContainer(): AppStylesContainer {
  //   return this.appEditableContext.getAppStylesContainer();
  // }

  // /**
  //  * AppStylesContainer를 설정합니다
  //  */
  // @boundMethod
  // public setAppStylesContainer(appStylesContainer: AppStylesContainer): void {
  //   this.appEditableContext.setAppStylesContainer(appStylesContainer);
  // }

  // /**
  //  * BusinessContainer를 반환합니다
  //  */
  // @boundMethod
  // public getBusinessContainer(): BusinessContainerBase {
  //   return this.appEditableContext.getBusinessContainer();
  // }

  // /**
  //  * BusinessContainer를 설정합니다
  //  */
  // @boundMethod
  // public setBusinessContainer(businessContainer: BusinessContainerBase): void {
  //   this.appEditableContext.setBusinessContainer(businessContainer);
  // }

  // /**
  //  * NewBusinessContainer를 반환합니다
  //  */
  // @boundMethod
  // public getNewBusinessContainer(): NewBusinessContainer {
  //   return this.appEditableContext.getNewBusinessContainer();
  // }

  // /**
  //  * NewBusinessContainer를 설정합니다
  //  */
  // @boundMethod
  // public setNewBusinessContainer(newBusinessContainer: NewBusinessContainer): void {
  //   this.appEditableContext.setNewBusinessContainer(newBusinessContainer);
  // }

  // /**
  //  * NewOSObjectContainer를 반환합니다
  //  */
  // @boundMethod
  // public getNewOSObjectContainer(): NewOSObjectContainer {
  //   return this.appEditableContext.getNewOSObjectContainer();
  // }

  // /**
  //  * NewOSObjectContainer를 설정합니다
  //  */
  // @boundMethod
  // public setNewOSObjectContainer(newOSObjectContainer: NewOSObjectContainer): void {
  //   this.appEditableContext.setNewOSObjectContainer(newOSObjectContainer);
  // }

  // /**
  //  * DataStore를 반환합니다
  //  */
  // @boundMethod
  // public getDataStore(): DataStoreBase {
  //   return this.appEditableContext.getDataStore();
  // }

  // /**
  //  * DataStore를 설정합니다
  //  */
  // @boundMethod
  // public setDataStore(dataStore: DataStoreBase): void {
  //   this.appEditableContext.setDataStore(dataStore);
  // }

  // /**
  //  * Custom Function 관리자 반환
  //  */
  // @boundMethod
  // public getCustomFunctionStore(): CustomFunctionStoreBase {
  //   return this.appEditableContext.getCustomFunctionStore();
  // }

  // /**
  //  * Custom Function 관리자 설정
  //  */
  // @boundMethod
  // public setCustomFunctionStore(customFunctionStore: CustomFunctionStoreBase): void {
  //   this.appEditableContext.setCustomFunctionStore(customFunctionStore);
  // }

  // /**
  //  * 서비스 매핑 관리자 반환
  //  */
  // @boundMethod
  // public getServiceStore(): ServiceStoreBase {
  //   return this.appEditableContext.getServiceStore();
  // }

  // /**
  //  * 서비스 매핑 관리자 설정
  //  */
  // @boundMethod
  // public setServiceStore(serviceStore: ServiceStoreBase): void {
  //   this.appEditableContext.setServiceStore(serviceStore);
  // }

  // /**
  //  * CMSEventHandlerStore를 반환합니다
  //  */
  // @boundMethod
  // public getServiceHandlerStore(): ServiceHandlerStoreBase {
  //   return this.appEditableContext.getServiceHandlerStore();
  // }

  // /**
  //  * CMSEventHandlerStore를 설정합니다
  //  */
  // @boundMethod
  // public setServiceHandlerStore(serviceHandlerStore: ServiceHandlerStoreBase): void {
  //   return this.appEditableContext.setServiceHandlerStore(serviceHandlerStore);
  // }

  // /**
  //  * DataBindingContainer를 반환합니다
  //  */
  // @boundMethod
  // public getDataBindingContainer(): DataBindingContainer {
  //   return this.appEditableContext.getDataBindingContainer();
  // }

  // /**
  //  * DataBindingContainer를 설정합니다
  //  */
  // @boundMethod
  // public setDataBindingContainer(dataBindingContainer: DataBindingContainer): void {
  //   this.appEditableContext.setDataBindingContainer(dataBindingContainer);
  // }

  // /**
  //  * UiStore를 반환합니다
  //  */
  // @boundMethod
  // public getUiStore(): UIStore {
  //   return this.appEditableContext.getUiStore();
  // }

  // /**
  //  * UiStore를 설정합니다
  //  */
  // @boundMethod
  // public setUiStore(uiStore: UIStore): void {
  //   this.appEditableContext.setUiStore(uiStore);
  // }

  // /**
  //  * BusinessComponentServiceMapper를 반환합니다
  //  */
  // @boundMethod
  // public getBusinessComponentServiceMapper(): BusinessComponentServiceMapper {
  //   return this.appEditableContext.getBusinessComponentServiceMapper();
  // }

  // /**
  //  * BusinessComponentServiceMapper를 설정합니다
  //  */
  // @boundMethod
  // public setBusinessComponentServiceMapper(businessComponentServiceMapper: BusinessComponentServiceMapper): void {
  //   this.appEditableContext.setBusinessComponentServiceMapper(businessComponentServiceMapper);
  // }

  /**
   * NavigateFunction를 반환합니다
   */
  @boundMethod
  public getNavigateFunction(): Nullable<NavigateFunction> {
    return this.appEditableContext.getNavigateFunction();
  }

  /**
   * NavigateFunction를 설정합니다
   */
  @boundMethod
  public setNavigateFunction(navigateFunction: NavigateFunction): void {
    this.appEditableContext.setNavigateFunction(navigateFunction);
  }

  /**
   * drawingToolContainer를 반환합니다
   */
  // @boundMethod
  // public getDrawingToolContainer(): DrawingToolContainer {
  //   return this.appEditableContext.getDrawingToolContainer();
  // }

  // /**
  //  * GlobalThemeContainer를 반환합니다
  //  */
  // @boundMethod
  // public getGlobalThemeContainer(): GlobalThemeContainer {
  //   return this.appEditableContext.getGlobalThemeContainer();
  // }

  // /**
  //  * CompThemeContainer를 반환합니다
  //  */
  // @boundMethod
  // public getCompThemeContainer(): CompThemeContainer {
  //   return this.appEditableContext.getCompThemeContainer();
  // }

  // /**
  //  * CompostieComponentContainer를 반환합니다
  //  */
  // @boundMethod
  // public getCompositeComponentContainer(): CompositeComponentContainer {
  //   return this.appEditableContext.getCompositeComponentContainer();
  // }

  // /**
  //  * OUTER 서비스 매핑 관리자 반환
  //  */
  // @boundMethod
  // public getOuterServiceStore(): OuterServiceStoreBase {
  //   return this.appEditableContext.getOuterServiceStore() as OuterServiceStoreBase;
  // }

  // /**
  //  * OUTER 서비스 매핑 관리자 설정
  //  */
  // @boundMethod
  // public setOuterServiceStore(OuterServiceStore: OuterServiceStoreBase): void {
  //   this.appEditableContext.setOuterServiceStore(OuterServiceStore);
  // }

  // /**
  //  * 스튜디오 컴포넌트 정보 관리자 반환
  //  */
  // @boundMethod
  // public getHighLevelStudiosContainer(): HighLevelStudiosContainer {
  //   return this.appEditableContext.getHighLevelStudiosContainer();
  // }
}
