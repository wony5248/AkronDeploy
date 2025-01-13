import { Nullable } from '@akron/runner';
import AppModel from 'models/node/AppModel';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import WidgetCommandProps from 'models/store/command/widget/WidgetCommandProps';
import AppModeContainer from 'models/store/container/AppModeContainer';
import AppStylesContainer from 'models/store/container/AppStylesContainer';
import ClipboardContainer from 'models/store/container/ClipboardContainer';
import CompositeComponentContainer from 'models/store/container/CompositeComponentContainer';
import HitContainer from 'models/store/container/HitContainer';
import IdContainerController from 'models/store/container/IdContainerController';
import PageContainer from 'models/store/container/PageContainer';
import PropContainer from 'models/store/container/PropContainer';
import SelectionContainer from 'models/store/container/SelectionContainer';
import UpdateMessageContainer from 'models/store/container/UpdateMessageContainer';
import WidgetEditInfoContainer from 'models/store/container/WidgetEditInfoContainer';
import { SaveState } from 'models/store/EditorStore';
import EventState from 'models/store/event/EventState';
import { NavigateFunction } from 'react-router-dom';
import { AppInfo } from 'store/app/AppInfo';
import EditorUIStore from 'store/app/EditorUIStore';
import ContextMenuContainer from 'store/context-menu/ContextMenuContainer';
import { ContextMenu } from 'store/context-menu/ContextMenuTypes';
import { LeftToolPaneType } from 'store/toolpane/ToolPaneComponentInfo';

/**
 * Runtime의 AppContextBase와 Client의 AppContext가 서로 상속관계가 아니기 때문에,
 * AppContextBase / AppContext 를 포괄하는 type이 없어 별도로 생성한 interface
 * 함수의 인자로 사용할 때 문제가 될 수 있었음(BusinessComponentService 의 execute 함수 등)
 * 내부의 함수는 AppContextBase(Runtime), AppContext(Client) 만 구현하도록 함
 * 관련하여 문의사항은 GX/UX 팀에 문의 바랍니다.
 */
export interface ContextDefaultInterface {
  doNotImplementThisFunctionExceptAppContext: () => void;
  getAppID: () => WidgetID;
  getAppInfo: () => AppInfo;
  //   getDataStore: () => DataStoreBase;
  //   getCustomFunctionStore: () => CustomFunctionStoreBase;
  //   getServiceStore: () => ServiceStoreBase;
  //   getServiceHandlerStore: () => ServiceHandlerStoreBase;
  //   getNewMetaDataContainer: () => NewMetaDataContainer;
  //   getBusinessContainer: () => BusinessContainerBase;
  //   getNewBusinessContainer: () => NewBusinessContainer;
  //   getDataBindingContainer: () => DataBindingContainer;
  //   getNewAppModel: () => AppModel;
  //   getUiStore: () => UIStore;
  //   getAppStylesContainer: () => AppStylesContainer;
  getNavigateFunction: () => Nullable<NavigateFunction>;
  setNavigateFunction: (navigateFunction: NavigateFunction) => void;
  //   getBusinessComponentServiceMapper: () => BusinessComponentServiceMapper;
  callOnClickedRibbonButton?: (commandPropName: string, commandType: string, ...args: unknown[]) => void;
  //   getGlobalThemeContainer: () => GlobalThemeContainer;
  //   getCompThemeContainer: () => CompThemeContainer;
  //   getCompositeComponentContainer: () => CompositeComponentContainer;
  //   getNewOSObjectContainer: () => NewOSObjectContainer;
  //   getOuterServiceStore: () => OuterServiceStoreBase;
  //   getDrawingToolContainer: () => DrawingToolContainer;
  //   getHighLevelStudiosContainer: () => HighLevelStudiosContainer;
}

/**
 * AppContextBaseInitilizeProp
 */
export interface ContextBaseInitializeProp {
  appID: WidgetID;
  //   dataStore: DataStoreBase;
  //   customFunctionStore: CustomFunctionStoreBase;
  //   serviceStore: ServiceStoreBase;
  //   serviceHandlerStore: ServiceHandlerStoreBase;
  //   newMetaDataContainer: NewMetaDataContainer;
  newAppModel: AppModel;
  appInfo: AppInfo;
  //   businessContainer: BusinessContainerBase;
  //   newBusinessContainer: NewBusinessContainer;
  //   dataBindingContainer: DataBindingContainer;
  //   globalThemeContainer: GlobalThemeContainer;
  //   compThemeContainer: CompThemeContainer;
  compositeComponentContainer: CompositeComponentContainer;
  //   newOSObjectContainer: NewOSObjectContainer;
  //   outerServiceStore: OuterServiceStoreBase;
  //   highLevelStudiosContainer: HighLevelStudiosContainer;
}

/**
 * AppReadOnlyContextBaseProp
 */
export interface ReadOnlyContextBaseProp {
  appID: number;
}

/**
 * AppEditableContextBaseProp
 */
export interface EditableContextBaseProp {
  newAppModel: AppModel;
  appID: number;
  appInfo: AppInfo;
  //   newMetaDataContainer: NewMetaDataContainer;
  appStylesContainer: AppStylesContainer;
  //   businessContainer: BusinessContainerBase;
  //   newBusinessContainer: NewBusinessContainer;
  //   dataStore: DataStoreBase;
  //   customFunctionStore: CustomFunctionStoreBase;
  //   serviceStore: ServiceStoreBase;
  //   serviceHandlerStore: ServiceHandlerStoreBase;
  //   dataBindingContainer: DataBindingContainer;
  //   uiStore: UIStore;
  //   businessComponentServiceMapper: BusinessComponentServiceMapper;
  navigateFunction?: NavigateFunction;
  //   globalThemeContainer: GlobalThemeContainer;
  //   compThemeContainer: CompThemeContainer;
  //   compositeComponentContainer: CompositeComponentContainer;
  //   newOSObjectContainer: NewOSObjectContainer;
  //   outerServiceStore: OuterServiceStoreBase;
  //   highLevelStudiosContainer: HighLevelStudiosContainer;
}

/**
 * AppContextInitilizeProp
 */
export interface ContextInitializeProp extends ContextBaseInitializeProp {
  eventState: EventState;
  appName: string;
  // user: UserModel;
  appModeContainer: AppModeContainer;
  startPageID: number;
  startPageURL: string;
  contextMenuContainer: ContextMenuContainer;
  // customPropertyContentRenderer?: WidgetPropertyContentRenderer;
  activeLeftToolPaneType?: LeftToolPaneType;
  // handleRemoteMessages: (props: RemoteUserCommandProps[]) => void;
  // collaborationContainerController: CollaborationContainerController;
  // outerServiceStore: OuterServiceStore;
  // fileContainer: FileContainer;
  // insertedPuxLibraryInfoMap: InsertedPuxLibraryInfoMap;
  // libraryContainer: LibraryContainer;
  editorUIStore: EditorUIStore;
}

/**
 * 프로젝트의 스크롤 위치
 */
export interface PageScroll {
  left: number;
  top: number;
}
/**
 * MouseModeType
 */
export type MouseModeType = 'Normal' | 'InsertContainer';

/**
 * DragObjectType
 */
export type DragObjectType = 'Thumbnail' | 'Section' | undefined;

/**
 * AppEditableContextProp
 */
export interface EditableContextProp extends EditableContextBaseProp {
  eventState: EventState;
  appName: string;
  appModeContainer: AppModeContainer;
  //   roomList: RoomModel[];
  needSaveState: boolean;
  commandProps?: WidgetCommandProps;
  //   commandController?: CommandController;
  //   previewCommandCompositor?: CommandCompositor;
  //   commandMode: CommandMode;
  saveState: SaveState;
  //   fileSaveState: FileSaveState;
  zoomRatio: number;
  previewZoomRatio: number;
  pageScroll: PageScroll;
  isFitWindow: boolean;
  dragObject: DragObjectType;
  mouseMode: MouseModeType;
  contextMenu: ContextMenu | null;
  saved: boolean;
  //   dialogType?: dialogContentType;
  dialogOpen: boolean;
  //   undoStack: UndoStack;
  //   undoRedoProps?: IUndoRedoProps;
  lastRegisteredEditUndoStackTag: string;
  hitContainer: HitContainer<WidgetModel>;
  selectionContainer: SelectionContainer;
  clipboardContainer: ClipboardContainer;
  propContainer: PropContainer;
  widgetEditInfoContainer: WidgetEditInfoContainer;
  //   errorBoundaryContainer: ErrorBoundaryContainer;
  //   smartGuideContainer: SmartGuideContainer;
  updateMessageContainer: UpdateMessageContainer;
  pageContainer: PageContainer;
  editorUIStore: EditorUIStore;
  //   outerServiceStore: OuterServiceStore;
  idContainerController: IdContainerController;
  contextMenuContainer: ContextMenuContainer;
  //   fileMessageContainer: FileMessageContainer;
  //   registeredLibraryInfoMap: RegisteredLibraryInfoMap;
  //   fileContainer: FileContainer;
  //   insertedPuxLibraryInfoMap: InsertedPuxLibraryInfoMap;
  //   libraryContainer: LibraryContainer;
  //   widgetHandToolContainer: WidgetHandToolContainer;
}
