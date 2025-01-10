import { Nullable } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { observable, makeObservable, action, runInAction } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import Command from 'models/store/command/common/Command';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AppModeContainer from 'models/store/container/AppModeContainer';
import ClipboardContainer from 'models/store/container/ClipboardContainer';
import HitContainer from 'models/store/container/HitContainer';
import IdContainerController from 'models/store/container/IdContainerController';
import PageContainer from 'models/store/container/PageContainer';
import PropContainer from 'models/store/container/PropContainer';
import SelectionContainer from 'models/store/container/SelectionContainer';
import SubToolpaneContainer from 'models/store/container/SubToolpaneContainer';
import UpdateMessageContainer from 'models/store/container/UpdateMessageContainer';
import WidgetEditInfoContainer from 'models/store/container/WidgetEditInfoContainer';
import { DragObjectType, EditableContextProp, MouseModeType, PageScroll } from 'models/store/context/ContextTypes';
import EditableContextBase from 'models/store/context/EditableContextBase';
import { SaveState } from 'models/store/EditorStore';
import EventState from 'models/store/event/EventState';
import EditorUIStore from 'store/app/EditorUIStore';
import ContextMenuContainer from 'store/context-menu/ContextMenuContainer';
import { ContextMenu } from 'store/context-menu/ContextMenuTypes';

/**
 * DOM으로부터 얻은 page의 좌표(browser 기준)
 * width, height은 style에 있음
 */
export interface PageRefPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 현재 편집 중인 app의 정보 및 편집기의 상태들을 담고 있습니다.
 * AppStore는 command, event 등의 로직들을 현재의 AppContextBase 값 위에 정해진 순서대로 적용하는 형태로 작동합니다.
 * (CM/C (Component Manager / Component) 구조)
 */
class EditableContext extends EditableContextBase {
  /**
   * ContextMenuContainer
   * Context menu에 필요한 내용을 관리합니다..
   */
  contextMenuContainer: ContextMenuContainer;
  /**
   * 현재 수정중인 widget의 model입니다.
   * (ex. App or Composite)
   */
  @observable
  private editingNewWidgetModel: WidgetModel;

  /**
   * 현재 event 의 command id 와 handling 에 필요한 요소들을 나타냅니다. 휘발적이며 event 마다 초기화 됩니다.
   */
  @observable
  private commandProps?: WidgetCommandProps;

  /**
   * 현재 App의 이름을 나타냅니다.
   */
  @observable
  private appName: string;

  /**
   * Mouse Event로 드래깅 시 Hit 정보들을 저장하는 Container 입니다.
   */
  @observable
  private hitContainer: HitContainer<WidgetModel>;

  /**
   * 현재 선택된 Selection 정보
   */
  @observable
  private selectionContainer: SelectionContainer | undefined;

  /**
   * 이전에 선택된 Selection 정보
   */
  @observable
  private prevSelectionContainer?: SelectionContainer;

  /**
   * 마지막의 selection prop을 나타냄, selection prop이 있을 때 common selection manager에서 update 됨
   */
  private lastSelectionProp?: SelectionProp | undefined;

  /**
   * local floating object container
   */
  // @observable
  // private localFloatingObjectContainer: LocalFloatingObjectContainer;

  /**
   * Clipboard 정보
   */
  @observable
  private clipboardContainer: ClipboardContainer;

  /**
   * 현재 Selection을 바탕으로, 업데이트되어야 할 Style의 정보를 보관합니다.
   */
  @observable
  private propContainer: PropContainer;

  /**
   * 모드 변경 전, 마지막으로 선택된 Selection 정보
   */
  @observable
  private editModeLastSelectionContainer?: SelectionContainer;

  /**
   * WidgetEditModelInfoContainer
   * App에 배치 된 Widget을 끌어서 이동/리사이즈 할 유지되어야 하는 정보들을 보관합니다.
   */
  @observable
  private widgetEditInfoContainer: WidgetEditInfoContainer;

  /**
   * WidgetEditModelInfoContainer
   * App에 배치 된 Widget을 끌어서 이동/리사이즈 할 유지되어야 하는 정보들을 보관합니다.
   */
  @observable
  private readonly idContainerController: IdContainerController;

  /**
   * ErrorBoundaryContainer
   * 속성 값 오류로 인해 렌더링 오류가 발생한 WidgetModel들을 관리합니다..
   */
  // private errorBoundaryContainer: ErrorBoundaryContainer;

  /**
   * 문서에 포함된 file을 저장할 때의 저장 상태를 나타냅니다.
   * FileUpdateRepository 참고
   */
  // @observable
  // private fileSaveState: FileSaveState;

  /**
   * 저장 작업 진행중일 때, 해당 저장 작업 이후 다시 저장 작업이 필요한지를 나타냅니다.
   */
  @observable
  private saveState: SaveState;

  /**
   * 저장 작업 진행중일 때, 해당 저장 작업 이후 다시 저장 작업이 필요한지를 나타냅니다.
   */
  @observable
  private needSaveState: boolean;

  /**
   * UpdateMessage를 보관합니다.
   * 전송이 될 경우, Message를 비우고, 다시 생성하여 채웁니다.
   */
  @observable
  private updateMessageContainer: UpdateMessageContainer;

  /**
   * 마지막으로 문서가 저장된 시간을 나타냅니다.
   */
  @observable
  private lastSavedTime?: Date;

  /**
   * 페이지에 관련된 정보들을 담고 있습니다.
   */
  @observable
  private pageContainer: PageContainer;

  /**
   * 편집 UI 관련 공통 상태들을 관리하는 Store
   */
  @observable
  private editorUIStore: EditorUIStore;

  /**
   * 마지막으로 저장된 edit mode undostack 의 tag
   */
  @observable
  private lastRegisteredEditUndoStackTag: string;

  /**
   * zoom ratio를 나타냅니다.
   */
  @observable
  private zoomRatio: number;

  /**
   * preview zoom ratio를 나타냅니다.
   */
  @observable
  private previewZoomRatio: number;

  /**
   * 프로젝트의 스크롤 위치를 나타냅니다
   */
  @observable
  private pageScroll: PageScroll;

  /**
   * 화면 맞춤 여부를 나타냅니다.
   */
  @observable
  private isFitWindow: boolean;

  /*
   * Smart Guide 관련 정보가 있는 container
   */
  // @observable
  // private smartGuideContainer: SmartGuideContainer;

  /*
   * Smart Guide 관련 정보가 있는 container
   */
  // @observable
  // private widgetHandToolContainer: WidgetHandToolContainer;

  /**
   * OS object ID를 나타냅니다.
   */
  @observable
  private OSobjectID?: number;

  /**
   * drag하고 있는 object의 type.
   * 추후 drag되는 type 추가 시 DragContainer 등으로 분리하고 고도화가 필요함
   */
  @observable
  private dragObject: 'Thumbnail' | 'Section' | undefined;

  /**
   * 특정 동작을 하게 되는 마우스 상태
   */
  @observable
  private mouseMode: 'Normal' | 'InsertContainer';

  /**
   * Context Menu상태 및 마우스 좌표
   */
  @observable
  private contextMenu: ContextMenu | null;

  // 서버 통신 중인 메세지 관련 상태.
  @observable
  private saved: boolean;

  // 띄울 dialog type.
  // 현재 리본에서는 버튼이 dialog를 소유하고 open 여부를 결정하는데,
  // 추후 Editor에서처럼 아래 변수를 이용해 type 결정 및 open 여부를 context에서 해야 함
  // @observable
  // private dialogType: dialogContentType | undefined;

  // dialog open 여부.
  @observable
  private dialogOpen: boolean;

  // drag&drop 할때 drop된 위치의 targetModel
  @observable
  private dragDesModel?: WidgetModel;

  /**
   * 현재 Event의 상태를 나타냅니다. State에 따라 event manager 에서 처리하는 event handler 구성이 달라집니다.
   */
  @observable
  private state: EventState;

  /**
   * AppMode와 관련된 정보를 보관합니다.
   */
  @observable
  private appModeContainer: AppModeContainer;

  /**
   * 현재 event 에서 실행되어야 할 command 를 보관하는 자료구조 입니다.
   */
  private command?: Command;

  /**
   * 미리보기 동작을 위한 CommandCompositor입니다.
   */
  // @observable
  // previewCommandCompositor?: CommandCompositor;

  private previewCommandProps?: WidgetCommandProps;

  /**
   * Command 의 실행 Mode를 보관합니다.
   */
  // commandMode: CommandMode;

  /**
   * UndoStack와 관련된 정보를 보관합니다.
   */
  // @observable
  // undoStack: UndoStack;

  /**
   * undo 및 redo와 관련된 정보를 보관합니다.
   */
  // undoRedoProps?: IUndoRedoProps;

  // private fileMessageContainer: FileMessageContainer;

  // private fileContainer: FileContainer;

  // private libraryContainer: LibraryContainer;

  /**
   * 현재 프로젝트에서 등록한 라이브러리에 대한 정보입니다.
   */
  // @observable
  // public registeredLibraryInfoMap: Record<LibraryType, Map<number, ILibraryInfo>>;

  // /**
  //  * 현재 UX 프로젝트에서 삽입된 PUX 앱 별 라이브러리 관련 스토어 정보(서비스, 데이터)입니다.
  //  */
  // @observable
  // public insertedPuxLibraryInfoMap: InsertedPuxLibraryInfoMap;

  /**
   * 작업중인 page의 ref로부터 얻어온 page의 좌표값
   */
  private editingPageRefPosition: PageRefPosition;

  /**
   * 생성자
   */
  constructor(initProp: EditableContextProp) {
    super(initProp);
    makeObservable(this);

    this.editingNewWidgetModel = initProp.newAppModel;
    this.state = initProp.eventState;
    // this.fileSaveState = initProp.fileSaveState;
    this.appName = initProp.appName;
    this.appModeContainer = initProp.appModeContainer;
    this.needSaveState = initProp.needSaveState;
    this.commandProps = initProp.commandProps;
    this.saveState = initProp.saveState;
    // this.command = initProp.commandController;
    // this.previewCommandCompositor = initProp.previewCommandCompositor;
    // this.commandMode = initProp.commandMode;
    this.lastRegisteredEditUndoStackTag = initProp.lastRegisteredEditUndoStackTag;
    this.zoomRatio = initProp.zoomRatio;
    this.previewZoomRatio = initProp.previewZoomRatio;
    this.pageScroll = initProp.pageScroll;
    this.isFitWindow = initProp.isFitWindow;
    this.dragObject = initProp.dragObject;
    this.mouseMode = initProp.mouseMode;
    this.contextMenu = initProp.contextMenu;
    this.saved = initProp.saved;
    // this.dialogType = initProp.dialogType;
    this.dialogOpen = initProp.dialogOpen;
    // this.undoStack = initProp.undoStack;
    // this.undoRedoProps = initProp.undoRedoProps;
    this.hitContainer = initProp.hitContainer;
    this.selectionContainer = initProp.selectionContainer;
    // this.localFloatingObjectContainer = new LocalFloatingObjectContainer();
    this.clipboardContainer = initProp.clipboardContainer;
    this.propContainer = initProp.propContainer;
    this.widgetEditInfoContainer = initProp.widgetEditInfoContainer;
    // this.errorBoundaryContainer = initProp.errorBoundaryContainer;
    // this.smartGuideContainer = initProp.smartGuideContainer;
    this.updateMessageContainer = initProp.updateMessageContainer;
    this.pageContainer = initProp.pageContainer;
    this.editorUIStore = initProp.editorUIStore;
    this.contextMenuContainer = initProp.contextMenuContainer;
    this.idContainerController = initProp.idContainerController;
    // this.fileMessageContainer = initProp.fileMessageContainer;
    // this.registeredLibraryInfoMap = initProp.registeredLibraryInfoMap;
    // this.fileContainer = initProp.fileContainer;
    // this.insertedPuxLibraryInfoMap = initProp.insertedPuxLibraryInfoMap;
    // this.libraryContainer = initProp.libraryContainer;
    // this.widgetHandToolContainer = initProp.widgetHandToolContainer;
    // this.clearRegisteredLibraryInfoMap();
    this.editingPageRefPosition = { x: 0, y: 0, width: 0, height: 0 };
  }

  /**
   * editingNewWidgetModel 반환합니다
   */
  @boundMethod
  public getEditingNewWidgetModel(): WidgetModel {
    return this.editingNewWidgetModel;
  }

  /**
   * editingNewWidgetModel 설정합니다
   */
  @boundMethod
  public setEditingNewWidgetModel(editingNewWidgetModel: WidgetModel): void {
    this.editingNewWidgetModel = editingNewWidgetModel;
  }

  /**
   * EventState를 반환합니다
   */
  @boundMethod
  public getSaveState(): SaveState {
    return this.saveState;
  }

  /**
   * EventState를 설정합니다
   */
  @boundMethod
  public setSaveState(saveState: SaveState): void {
    this.saveState = saveState;
  }

  /**
   * EventState를 반환합니다
   */
  @boundMethod
  public getEventState(): EventState {
    return this.state;
  }

  /**
   * EventState를 설정합니다
   */
  @boundMethod
  public setEventState(state: EventState): void {
    this.state = state;
  }

  /**
   * AppName을 반환합니다
   */
  @boundMethod
  public getAppName(): string {
    return this.appName;
  }

  /**
   * AppName을 설정합니다
   */
  @boundMethod
  public setAppName(appName: string): void {
    this.appName = appName;
  }

  /**
   * AppModeContainer를 반환합니다
   */
  @boundMethod
  public getAppModeContainer(): AppModeContainer {
    return this.appModeContainer;
  }

  /**
   * AppModeContainer를 설정합니다
   */
  @boundMethod
  public setAppModeContainer(appModeContainer: AppModeContainer): void {
    this.appModeContainer = appModeContainer;
  }

  /**
   * NeedSaveState를 반환합니다
   */
  @boundMethod
  public getNeedSaveState(): boolean {
    return this.needSaveState;
  }

  /**
   * NeedSaveState를 설정합니다
   */
  @boundMethod
  public setNeedSaveState(needSaveState: boolean): void {
    this.needSaveState = needSaveState;
  }

  /**
   * CommandProps를 반환합니다
   */
  @boundMethod
  public getCommandProps(): WidgetCommandProps | undefined {
    return this.commandProps;
  }

  /**
   * CommandProps를 설정합니다
   */
  @boundMethod
  public setCommandProps(commandProps: WidgetCommandProps | undefined): void {
    this.commandProps = commandProps;
  }

  /**
   * Command를 반환합니다
   */
  @boundMethod
  public getCommand(): Command | undefined {
    return this.command;
  }

  /**
   * Command를 설정합니다
   */
  @boundMethod
  public setCommand(command: Command | undefined): void {
    this.command = command;
  }

  // /**
  //  * PreviewCommand를 위한 CommandCompositor 를 반환합니다.
  //  *
  //  * @returns preview용 CommandCompositor
  //  */
  // @boundMethod
  // public getPreviewCommandCompositor(): CommandCompositor | undefined {
  //   return this.previewCommandCompositor;
  // }

  // /**
  //  * PreviewCommand를 위한 commandCompositor를 설정합니다.
  //  *
  //  * @param commandCompositor preview용 CommandCompositor
  //  */
  // @boundMethod
  // public setPreviewCommandCompositor(commandCompositor: CommandCompositor | undefined): void {
  //   this.previewCommandCompositor = commandCompositor;
  // }

  // /**
  //  * CommandMode를 반환합니다
  //  */
  // @boundMethod
  // public getCommandMode(): CommandMode {
  //   return this.commandMode;
  // }

  // /**
  //  * CommandMode를 설정합니다
  //  */
  // @boundMethod
  // public setCommandMode(commandMode: CommandMode): void {
  //   this.commandMode = commandMode;
  // }

  // /**
  //  * SaveState를 반환합니다
  //  */
  // @boundMethod
  // public getSaveState(): SaveState {
  //   return this.collaborationContainerController.getCollaborationContainer().getUpdateController().getSaveState();
  // }

  // /**
  //  * FileSaveState를 반환합니다
  //  */
  // @boundMethod
  // public getFileSaveState(): FileSaveState {
  //   return this.fileSaveState;
  // }

  // /**
  //  * FileSaveState를 설정합니다
  //  */
  // @boundMethod
  // public setFileSaveState(fileSaveState: FileSaveState): void {
  //   this.fileSaveState = fileSaveState;
  // }

  /**
   * LastRegisteredEditUndoStackTag를 반환합니다
   */
  @boundMethod
  public getLastRegisteredEditUndoStackTag(): string {
    return this.lastRegisteredEditUndoStackTag;
  }

  /**
   * LastRegisteredEditUndoStackTag를 설정합니다
   */
  @boundMethod
  public setLastRegisteredEditUndoStackTag(lastRegisteredEditUndoStackTag: string): void {
    this.lastRegisteredEditUndoStackTag = lastRegisteredEditUndoStackTag;
  }

  /**
   * ZoomRatio를 반환합니다
   */
  @boundMethod
  public getZoomRatio(): number {
    return this.zoomRatio;
  }

  /**
   * ZoomRatio를 설정합니다
   */
  @action
  public setZoomRatio(zoomRatio: number): void {
    this.zoomRatio = zoomRatio;
  }

  /**
   * PreviewZoomRatio를 반환합니다
   */
  @boundMethod
  public getPreviewZoomRatio(): number {
    return this.previewZoomRatio;
  }

  /**
   * PreviewZoomRatio를 설정합니다
   */
  @action
  public setPreviewZoomRatio(previewZoomRatio: number): void {
    this.previewZoomRatio = previewZoomRatio;
  }

  /**
   * 페이지 스크롤 위치를 반환합니다
   */
  @boundMethod
  public getPageScroll(): PageScroll {
    return this.pageScroll;
  }

  /**
   * 페이지 스크롤 위치를 설정합니다
   */
  @boundMethod
  public setPageScroll(pageScroll: PageScroll): void {
    runInAction(() => {
      this.pageScroll = pageScroll;
    });
  }

  /**
   * IsFitWindow를 반환합니다
   */
  @boundMethod
  public getIsFitWindow(): boolean {
    return this.isFitWindow;
  }

  /**
   * isFitWindow를 설정합니다
   */
  @boundMethod
  public setIsFitWindow(isFitWindow: boolean): void {
    this.isFitWindow = isFitWindow;
  }

  /**
   * DragObject를 반환합니다
   */
  @boundMethod
  public getDragObject(): DragObjectType {
    return this.dragObject;
  }

  /**
   * DragObject를 설정합니다
   */
  @boundMethod
  public setDragObject(dragObject: DragObjectType): void {
    this.dragObject = dragObject;
  }

  /**
   * MouseMode를 반환합니다
   */
  @boundMethod
  public getMouseMode(): MouseModeType {
    return this.mouseMode;
  }

  /**
   * MouseMode를 설정합니다
   */
  @boundMethod
  public setMouseMode(mouseMode: MouseModeType): void {
    this.mouseMode = mouseMode;
  }

  /**
   * ContextMenu를 반환합니다
   */
  @boundMethod
  public getContextMenu(): ContextMenu | null {
    return this.contextMenu;
  }

  /**
   * ContextMenu를 설정합니다
   */
  @boundMethod
  public setContextMenu(contextMenu: ContextMenu | null): void {
    this.contextMenu = contextMenu;
  }

  /**
   * Saved를 반환합니다
   */
  @boundMethod
  public getSaved(): boolean {
    return this.saved;
  }

  /**
   * Saved를 설정합니다
   */
  @boundMethod
  public setSaved(saved: boolean): void {
    this.saved = saved;
  }

  // /**
  //  * DialogType를 반환합니다
  //  */
  // @boundMethod
  // public getDialogType(): dialogContentType | undefined {
  //   return this.dialogType;
  // }

  // /**
  //  * DialogType를 설정합니다
  //  */
  // @boundMethod
  // public setDialogType(dialogType: dialogContentType | undefined): void {
  //   this.dialogType = dialogType;
  // }

  /**
   * DialogOpen를 반환합니다
   */
  @boundMethod
  public getDialogOpen(): boolean {
    return this.dialogOpen;
  }

  /**
   * DialogOpen를 설정합니다
   */
  @boundMethod
  public setDialogOpen(dialogOpen: boolean): void {
    this.dialogOpen = dialogOpen;
  }

  /**
   * dragDesModel을 반환합니다
   */
  @boundMethod
  public getDragDesModel(): WidgetModel | undefined {
    return this.dragDesModel;
  }

  /**
   * dragDesModel을 설정합니다
   */
  @boundMethod
  public setDragDesModel(dragDesModel: WidgetModel | undefined): void {
    this.dragDesModel = dragDesModel;
  }

  // /**
  //  * UndoStack을 반환합니다
  //  */
  // @boundMethod
  // public getUndoStack(): UndoStack {
  //   return this.undoStack;
  // }

  // /**
  //  * UndoStack을 설정합니다
  //  */
  // @boundMethod
  // public setUndoStack(undoStack: UndoStack): void {
  //   this.undoStack = undoStack;
  // }

  // /**
  //  * UndoRedoProp 을 반환합니다.
  //  *
  //  * @returns undoRedoProp
  //  */
  // @boundMethod
  // public getUndoRedoProp(): IUndoRedoProps | undefined {
  //   return this.undoRedoProps;
  // }

  // /**
  //  * UndoRedoProp을 설정합니다.
  //  *
  //  * @param undoRedoProps 실행 한 command의 undoRedo용 prop
  //  */
  // @boundMethod
  // public setUndoRedoProp(undoRedoProps: IUndoRedoProps): void {
  //   this.undoRedoProps = undoRedoProps;
  // }

  /**
   * HitContainer을 반환합니다
   */
  @boundMethod
  public getIdContainerController(): IdContainerController {
    return this.idContainerController;
  }

  /**
   * HitContainer을 설정합니다
   */
  @boundMethod
  public setHitContainerController(hitContainer: HitContainer<WidgetModel>): void {
    this.hitContainer = hitContainer;
  }

  /**
   * HitContainer을 반환합니다
   */
  @boundMethod
  public getHitContainer(): HitContainer<WidgetModel> {
    return this.hitContainer;
  }

  /**
   * HitContainer을 설정합니다
   */
  @boundMethod
  public setHitContainer(hitContainer: HitContainer<WidgetModel>): void {
    this.hitContainer = hitContainer;
  }

  /**
   * SelectionContainer을 설정합니다
   */
  @boundMethod
  public setSelectionContainer(selectionContainer: SelectionContainer | undefined) {
    return (this.selectionContainer = selectionContainer);
  }

  /**
   * SelectionContainer을 반환합니다
   */
  public getSelectionContainer(): SelectionContainer | undefined {
    return this.selectionContainer;
  }

  /**
   * PrevSelectionContainer을 반환합니다
   */
  @boundMethod
  public getPrevSelectionContainer(): Nullable<SelectionContainer> {
    return this.prevSelectionContainer;
  }

  /**
   * PrevSelectionContainer을 설정합니다
   */
  @boundMethod
  public setPrevSelectionContainer(prevSelectionContainer: Nullable<SelectionContainer>): void {
    this.prevSelectionContainer = prevSelectionContainer;
  }

  /**
   * 최신의 selection prop을 설정합니다
   *
   * @param selectionProp 설정하려는 최신의 SeletionProp
   */
  @boundMethod
  public setLastSelectionProp(selectionProp: SelectionProp | undefined): void {
    this.lastSelectionProp = selectionProp;
  }

  /**
   * 최신의 selection prop을 반환합니다
   *
   * @returns lastSelectionProp
   */
  @boundMethod
  public getLastSelectionProp(): SelectionProp | undefined {
    return this.lastSelectionProp;
  }

  /**
   * edit mode last SelectionContainer을 반환합니다
   */
  @boundMethod
  public getEditModeLastSelectionContainer(): Nullable<SelectionContainer> {
    return this.editModeLastSelectionContainer;
  }

  /**
   *  edit mode last SelectionContainer을 설정합니다
   */
  @boundMethod
  public setEditModeLastSelectionContainer(editModeLastSelectionContainer: Nullable<SelectionContainer>): void {
    this.editModeLastSelectionContainer = editModeLastSelectionContainer
      ? editModeLastSelectionContainer.clone()
      : undefined;
  }

  // /**
  //  * localFloatingObjectContainer를 반환합니다.
  //  *
  //  * @returns localFloatingObjectContainer
  //  */
  // @boundMethod
  // public getLocalFloatingObjectContainer(): LocalFloatingObjectContainer {
  //   return this.localFloatingObjectContainer;
  // }

  /**
   * ClipboardContainer을 반환합니다
   */
  @boundMethod
  public getClipboardContainer(): ClipboardContainer {
    return this.clipboardContainer;
  }

  /**
   * ClipboardContainer을 설정합니다
   */
  @boundMethod
  public setClipboardContainer(clipboardContainer: ClipboardContainer): void {
    this.clipboardContainer = clipboardContainer;
  }

  /**
   * PropContainer을 반환합니다
   */
  @boundMethod
  public getPropContainer(): PropContainer {
    return this.propContainer;
  }

  /**
   * PropContainer을 설정합니다
   */
  @boundMethod
  public setPropContainer(propContainer: PropContainer): void {
    this.propContainer = propContainer;
  }

  /**
   * WidgetEditInfoContainer을 반환합니다
   */
  @boundMethod
  public getWidgetEditInfoContainer(): WidgetEditInfoContainer {
    return this.widgetEditInfoContainer;
  }

  /**
   * WidgetEditInfoContainer을 설정합니다
   */
  @boundMethod
  public setWidgetEditInfoContainer(widgetEditInfoContainer: WidgetEditInfoContainer): void {
    this.widgetEditInfoContainer = widgetEditInfoContainer;
  }

  // /**
  //  * WidgetHandToolContainer 반환합니다
  //  */
  // @boundMethod
  // public getWidgetHandToolContainer(): WidgetHandToolContainer {
  //   return this.widgetHandToolContainer;
  // }

  // /**
  //  * WidgetHandToolContainer 설정합니다
  //  */
  // @boundMethod
  // public setWidgetHandToolContainer(widgetHandToolContainer: WidgetHandToolContainer): void {
  //   this.widgetHandToolContainer = widgetHandToolContainer;
  // }

  // /**
  //  * SmartGuideContainer을 반환합니다
  //  */
  // @boundMethod
  // public getSmartGuideContainer(): SmartGuideContainer {
  //   return this.smartGuideContainer;
  // }

  // /**
  //  * SmartGuideContainer을 설정합니다
  //  */
  // @boundMethod
  // public setSmartGuideContainer(smartGuideContainer: SmartGuideContainer): void {
  //   this.smartGuideContainer = smartGuideContainer;
  // }

  // /**
  //  * errorBoundaryContainer 반환
  //  */
  // public getErrorBoundaryContainer(): ErrorBoundaryContainer {
  //   return this.errorBoundaryContainer;
  // }

  // /**
  //  * errorBoundaryContainer 설정
  //  */
  // public setErrorBoundaryContainer(errorBoundaryContainer: ErrorBoundaryContainer) {
  //   this.errorBoundaryContainer = errorBoundaryContainer;
  // }

  /**
   * UpdateMessageContainer을 반환합니다
   */
  @boundMethod
  public getUpdateMessageContainer(): UpdateMessageContainer {
    return this.updateMessageContainer;
  }

  /**
   * UpdateMessageContainer을 설정합니다
   */
  @boundMethod
  public setUpdateMessageContainer(updateMessageContainer: UpdateMessageContainer): void {
    this.updateMessageContainer = updateMessageContainer;
  }

  /**
   * PageContainer을 반환합니다
   */
  @boundMethod
  public getPageContainer(): PageContainer {
    return this.pageContainer;
  }

  /**
   * PageContainer을 설정합니다
   */
  @boundMethod
  public setPageContainer(pageContainer: PageContainer): void {
    this.pageContainer = pageContainer;
  }

  /**
   * SubToolpaneContainer를 반환합니다.
   */
  @boundMethod
  public getSubToolpaneContainer(): SubToolpaneContainer {
    return this.propContainer.getSubToolpaneContainer();
  }

  /**
   * EditorUIStore을 반환합니다
   */
  @boundMethod
  public getEditorUIStore(): EditorUIStore {
    return this.editorUIStore;
  }

  /**
   * EditorUIStore을 설정합니다
   */
  @boundMethod
  public setEditorUIStore(editorUIStore: EditorUIStore): void {
    this.editorUIStore = editorUIStore;
  }

  /**
   * lastSavedTime을 반환합니다.
   */
  @boundMethod
  public getlastSavedTime(): Date | undefined {
    return this.lastSavedTime;
  }

  /**
   * lastSavedTime을 설정합니다.
   */
  @boundMethod
  public setLastSavedTime(lastSavedTime: Date | undefined): void {
    this.lastSavedTime = lastSavedTime;
  }

  /**
   * savePreviewCommandProps
   */
  @boundMethod
  public savePreviewCommandProps(): void {
    this.previewCommandProps = this.commandProps;
  }

  /**
   * getPreviewCommandProps
   */
  @boundMethod
  public getPreviewCommandProps(): WidgetCommandProps | undefined {
    return this.previewCommandProps;
  }

  /**
   * clearPreviewCommandProps
   */
  @boundMethod
  public clearPreviewCommandProps(): void {
    this.previewCommandProps = undefined;
  }

  /**
   * ContextMenuContainer를 반환합니다.
   */
  public getContextMenuContainer(): ContextMenuContainer {
    return this.contextMenuContainer;
  }

  // /**
  //  * FileMessageContainer를 반환합니다.
  //  *
  //  * @returns FileMessageContainer
  //  */
  // @boundMethod
  // public getFileMessageContainer(): FileMessageContainer {
  //   return this.fileMessageContainer;
  // }

  // /**
  //  * RegisteredLibraryInfo를 반환합니다
  //  */
  // @boundMethod
  // public getRegisteredLibraryInfoMap(): RegisteredLibraryInfoMap {
  //   return this.registeredLibraryInfoMap;
  // }

  // /**
  //  * InsertedPuxLibraryInfo를 반환합니다
  //  */
  // @boundMethod
  // public getInsertedPuxLibraryInfoMap(): InsertedPuxLibraryInfoMap {
  //   return this.insertedPuxLibraryInfoMap;
  // }

  // /**
  //  * RegisteredLibraryInfo를 반환합니다
  //  */
  // @boundMethod
  // public clearRegisteredLibraryInfoMap(): void {
  //   this.registeredLibraryInfoMap = {
  //     GXComponent: new Map<number, ILibraryInfo>(),
  //     UXComponent: new Map<number, ILibraryInfo>(),
  //     UXTemplate: new Map<number, ILibraryInfo>(),
  //   };
  // }

  // /**
  //  * InsertedPuxLibraryInfoMap을 반환합니다.
  //  */
  // @boundMethod
  // public setInsertedPuxLibraryInfoMap(insertedPuxLibraryInfoMap: Map<number, IPuxLibraryStoreIdMapContainer>): void {
  //   this.insertedPuxLibraryInfoMap = insertedPuxLibraryInfoMap;
  // }

  // /**
  //  * fileContainer 반환
  //  */
  // @boundMethod
  // public getFileContainer(): FileContainer {
  //   return this.fileContainer;
  // }

  // /**
  //  * libraryContainer 반환
  //  */
  // @boundMethod
  // public getLibraryContainer(): LibraryContainer {
  //   return this.libraryContainer;
  // }

  /**
   * editingPageRefPosition 값 셋팅.
   */
  @action
  public setEditingPageRefPosition(pageRefPosition: PageRefPosition) {
    this.editingPageRefPosition = pageRefPosition;
  }

  /**
   * editingPageRefPosition 값을 가져옴.
   */
  public getEditingPageRefPosition() {
    return this.editingPageRefPosition;
  }
}

export default EditableContext;
