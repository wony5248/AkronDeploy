import { boundMethod } from 'autobind-decorator';
import { action, makeObservable, observable } from 'mobx';
import AppModel from 'models/node/AppModel';
import PageModel from 'models/node/PageModel';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import Command from 'models/store/command/common/Command';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AppModeContainer from 'models/store/container/AppModeContainer';
import ClipboardContainer from 'models/store/container/ClipboardContainer';
import HitContainer from 'models/store/container/HitContainer';
import { IdList } from 'models/store/container/IdContainer';
import IdContainerController from 'models/store/container/IdContainerController';
import MetadataContainer from 'models/store/container/MetadataContainer';
import PageContainer from 'models/store/container/PageContainer';
import PropContainer from 'models/store/container/PropContainer';
import SelectionContainer from 'models/store/container/SelectionContainer';
import UpdateMessageContainer from 'models/store/container/UpdateMessageContainer';
import WidgetEditInfoContainer from 'models/store/container/WidgetEditInfoContainer';
import { ContextInitializeProp, DragObjectType, MouseModeType, PageScroll } from 'models/store/context/ContextTypes';
import { SaveState } from 'models/store/EditorStore';
import EventState from 'models/store/event/EventState';
import { AppInfo } from 'store/app/AppInfo';
import EditorUIStore from 'store/app/EditorUIStore';
import ContextMenuContainer from 'store/context-menu/ContextMenuContainer';
import { ContextMenu } from 'store/context-menu/ContextMenuTypes';
import { DialogContentType } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * Zoom 데이터 관리를 위한 상수
 */
export enum ZoomData {
  maximum = 3200,
  minimum = 1,
}

export interface PageRefPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * DocumentStore 에서 관리하는 context 구조입니다.
 */
export default class AkronContext {
  /**
   * Akron App Model
   */
  @observable
  private appModel: AppModel;

  /**
   * 현재 문서 ID를 나타냅니다.
   */
  @observable
  private appID: WidgetID;

  /**
   * App 의 Info
   */
  @observable
  private appInfo: AppInfo;

  /**
   * ContextMenuContainer
   * Context menu에 필요한 내용을 관리합니다..
   */
  private contextMenuContainer: ContextMenuContainer;

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
  @observable
  private dialogType: DialogContentType | undefined;

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
  private eventState: EventState;

  /**
   * AppMode와 관련된 정보를 보관합니다.
   */
  @observable
  private appModeContainer: AppModeContainer;

  @observable
  private metadataContainer: MetadataContainer;

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

  /**
   * 작업중인 page의 ref로부터 얻어온 page의 좌표값
   */
  private pageRefPosition: PageRefPosition;
  /**
   * 생성자
   */
  constructor(initProp: ContextInitializeProp) {
    makeObservable(this);
    this.appModel = initProp.newAppModel;
    this.appID = initProp.appID;
    this.appInfo = initProp.appInfo;
    this.eventState = initProp.eventState;
    this.appName = initProp.appName;
    this.appModeContainer = initProp.appModeContainer;
    this.needSaveState = this.createNeedSaveState();
    this.commandProps = this.createCommandProps();
    this.saveState = this.createSaveState();
    this.zoomRatio = this.createZoomRatio();
    this.previewZoomRatio = this.createPreviewZoomRatio();
    this.pageScroll = this.createPageScroll();
    this.isFitWindow = this.createIsFitWindow();
    this.dragObject = this.createDragObject();
    this.mouseMode = this.createMouseMode();
    this.contextMenu = this.createContextMenu();
    this.saved = this.createSaved();
    this.dialogType = undefined;
    this.dialogOpen = this.createDialogOpen();
    // this.undoStack = initProp.undoStack;
    // this.undoRedoProps = initProp.undoRedoProps;
    this.hitContainer = this.createHitContainer();
    this.selectionContainer = this.createSelectionContainer(initProp.newAppModel);
    this.clipboardContainer = this.createClipboardContainer();
    this.propContainer = this.createPropContainer();
    this.widgetEditInfoContainer = this.createWidgetEditInfoContainer();
    this.updateMessageContainer = this.createUpdateMessageContainer();
    this.pageContainer = this.createPageContainer({
      startPageID: initProp.startPageID,
      startPageURL: initProp.startPageURL,
    });
    this.editorUIStore = initProp.editorUIStore;
    this.contextMenuContainer = initProp.contextMenuContainer;
    this.metadataContainer = initProp.metadataContainer;
    this.idContainerController = this.createIdContainerController({ componentId: initProp.startElementId }, 1, 1, 1);
    this.pageRefPosition = { x: 0, y: 0, width: 0, height: 0 };
  }

  /**
   * AppID를 반환합니다
   */
  @boundMethod
  public getAppID(): WidgetID {
    return this.appID;
  }

  /**
   * AppWidgetModel을 반환합니다
   */
  @boundMethod
  public getAppModel(): AppModel {
    return this.appModel;
  }

  /**
   * AppWidgetModel을 설정합니다
   */
  @boundMethod
  public setAppModel(appModel: AppModel): void {
    this.appModel = appModel;
  }

  /**
   * AppID를 설정합니다
   */
  @boundMethod
  public setAppID(appID: WidgetID): void {
    this.appID = appID;
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
  @boundMethod
  public setZoomRatio(zoomRatio: number): void {
    const resultZoomRatio = Math.max(ZoomData.minimum, Math.min(zoomRatio, ZoomData.maximum));
    this.zoomRatio = resultZoomRatio;
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
  @boundMethod
  public setPreviewZoomRatio(previewZoomRatio: number): void {
    const resultZoomRatio = Math.max(ZoomData.minimum, Math.min(previewZoomRatio, ZoomData.maximum));
    this.previewZoomRatio = resultZoomRatio;
  }

  /**
   * DialogType를 반환합니다
   */
  @boundMethod
  public getDialogType(): DialogContentType | undefined {
    return this.dialogType;
  }

  /**
   * DialogType를 설정합니다
   */
  @boundMethod
  public setDialogType(dialogType: DialogContentType | undefined): void {
    this.dialogType = dialogType;
  }

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
   * DocumentContext
   * CommandProps를 반환합니다
   */
  @boundMethod
  public getCommandProps(): WidgetCommandProps | undefined {
    return this.commandProps;
  }

  /**
   * DocumentContext
   * CommandProps를 설정합니다
   */
  @boundMethod
  public setCommandProps(commandProps: WidgetCommandProps | undefined): void {
    this.commandProps = commandProps;
  }

  /**
   * DocumentContext
   * Command를 반환합니다
   */
  @boundMethod
  public getCommand(): Command | undefined {
    return this.command;
  }

  /**
   * DocumentContext
   * Command를 설정합니다
   */
  @boundMethod
  public setCommand(command: Command | undefined): void {
    this.command = command;
  }

  /**
   * UpdateMessageContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createUpdateMessageContainer(): UpdateMessageContainer {
    return new UpdateMessageContainer();
  }

  /**
   * UpdateMessageContainer을 반환합니다
   */
  @boundMethod
  public getUpdateMessageContainer(): UpdateMessageContainer {
    return this.updateMessageContainer;
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
   * DocumentContext
   * SelectionContainer을 설정합니다
   */
  @boundMethod
  public setSelectionContainer(selectionContainer: SelectionContainer | undefined) {
    this.selectionContainer = selectionContainer;
  }

  /**
   * DocumentContext
   * SelectionContainer을 반환합니다
   */
  @boundMethod
  public getSelectionContainer(): SelectionContainer | undefined {
    return this.selectionContainer;
  }

  /**
   * DocumentContext
   * SelectionContainer을 설정합니다
   */
  @boundMethod
  public setClipboardContainer(clipboardContainer: ClipboardContainer) {
    this.clipboardContainer = clipboardContainer;
  }

  /**
   * DocumentContext
   * SelectionContainer을 반환합니다
   */
  @boundMethod
  public getClipboardContainer(): ClipboardContainer {
    return this.clipboardContainer;
  }

  /**
   * DocumentContext
   * SelectionContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createSelectionContainer(appModel: AppModel): SelectionContainer {
    const selectionContainer = new SelectionContainer();
    const firstPage = appModel.getFirstChild() as PageModel;
    selectionContainer.setEditingPage(appModel.getFirstChild());
    firstPage.setSelected(true);
    selectionContainer.setSelectedPage(firstPage);
    return selectionContainer;
  }

  /**
   * WidgetEditInfoContainer을 반환합니다
   */
  @boundMethod
  public getWidgetEditInfoContainer(): WidgetEditInfoContainer {
    return this.widgetEditInfoContainer;
  }

  /**
   * ID containers initializer
   */
  @boundMethod
  public createIdContainerController(idList: IdList, gap: number, order: number, users: number): IdContainerController {
    return new IdContainerController({ idList, gap, order, users });
  }

  /**
   * HitContainer을 반환합니다
   */
  @boundMethod
  public getIdContainerController(): IdContainerController {
    return this.idContainerController;
  }

  /**
   * WidgetEditInfoContainer을 설정합니다
   */
  @boundMethod
  public setWidgetEditInfoContainer(widgetEditInfoContainer: WidgetEditInfoContainer): void {
    this.widgetEditInfoContainer = widgetEditInfoContainer;
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
   * HitContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createHitContainer(): HitContainer<WidgetModel> {
    return new HitContainer();
  }

  /**
   * WidgetEditInfoContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createWidgetEditInfoContainer(): WidgetEditInfoContainer {
    return new WidgetEditInfoContainer();
  }

  /**
   * ClipboardContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createClipboardContainer(): ClipboardContainer {
    return new ClipboardContainer();
  }

  /**
   * PropContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createPropContainer(): PropContainer {
    return new PropContainer();
  }

  /**
   * SaveState 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createSaveState(): SaveState {
    return SaveState.SAVE_COMPLETE;
  }

  /**
   * PageScroll 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createPageScroll(): PageScroll {
    return { top: -1, left: -1 };
  }

  /**
   * PageScroll을 반환합니다
   */
  @boundMethod
  public getPageScroll(): PageScroll {
    return this.pageScroll;
  }

  /**
   * PageScroll을 설정합니다
   */
  @boundMethod
  public setPageScroll(pageScroll: PageScroll): void {
    this.pageScroll = pageScroll;
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
   * ContextMenuContainer를 반환합니다.
   */
  public getContextMenuContainer(): ContextMenuContainer {
    return this.contextMenuContainer;
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

  /**
   * SaveState를 반환합니다
   */
  @boundMethod
  public getSaveState(): SaveState {
    return this.saveState;
  }

  /**
   * SaveState를 반환합니다
   */
  @boundMethod
  public setSaveState(saveState: SaveState): void {
    this.saveState = saveState;
  }

  /**
   * NeedSaveState 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createNeedSaveState(): boolean {
    return false;
  }

  /**
   * CommandProps 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createCommandProps(): WidgetCommandProps | undefined {
    return undefined;
  }

  /**
   * ZoomRatio 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createZoomRatio(): number {
    return 100;
  }

  /**
   * PreviewZoomRatio 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createPreviewZoomRatio(): number {
    return 50;
  }

  /**
   * DocumentContext
   * EventState를 반환합니다
   */
  @boundMethod
  public getEventState(): EventState {
    return this.eventState;
  }

  /**
   * DocumentContext
   * EventState를 설정합니다
   */
  @boundMethod
  public setEventState(eventState: EventState): void {
    this.eventState = eventState;
  }

  /**
   * NeedSaveState를 설정합니다
   */
  @boundMethod
  public setNeedSaveState(needSaveState: boolean): void {
    this.needSaveState = needSaveState;
  }

  /**
   * NeedSaveState를 반환합니다
   */
  @boundMethod
  public getNeedSaveState(): boolean {
    return this.needSaveState;
  }

  /**
   * AppInfo를 반환합니다
   */
  @boundMethod
  public getAppInfo(): AppInfo {
    return this.appInfo;
  }

  /**
   * AppInfo를 설정합니다
   */
  @boundMethod
  public setAppInfo(appInfo: AppInfo): void {
    this.appInfo = appInfo;
  }

  /**
   * IsFitWindow 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createIsFitWindow(): boolean {
    return false;
  }

  /**
   * DragObject 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createDragObject(): DragObjectType {
    return undefined;
  }

  /**
   * MouseMode 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createMouseMode(): MouseModeType {
    return 'Normal';
  }

  /**
   * ContextMenu 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createContextMenu(): ContextMenu | null {
    return null;
  }

  /**
   * Saved 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createSaved(): boolean {
    return true;
  }

  /**
   * DialogType 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createDialogOpen(): boolean {
    return false;
  }

  /**
   * dragDesModel getter
   */
  @boundMethod
  public getDragDesModel(): WidgetModel | undefined {
    return this.dragDesModel;
  }

  /**
   * dragDesModel setter
   */
  @boundMethod
  public setDragDesModel(dragDesModel: WidgetModel | undefined): void {
    this.dragDesModel = dragDesModel;
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
   * edit Mode Last SelectionContainer을 반환합니다
   */
  @boundMethod
  public getEditModeLastSelectionContainer(): SelectionContainer | undefined {
    return this.editModeLastSelectionContainer;
  }

  /**
   *  edit Mode last SelectionContainer을 설정합니다
   */
  @boundMethod
  public setEditModeLastSelectionContainer(editModeLastSelectionContainer: SelectionContainer | undefined): void {
    this.editModeLastSelectionContainer = editModeLastSelectionContainer;
  }

  /**
   * PrevSelectionContainer을 반환합니다
   */
  @boundMethod
  public getPrevSelectionContainer(): SelectionContainer | undefined {
    return this.prevSelectionContainer;
  }

  /**
   * PrevSelectionContainer을 설정합니다
   */
  @boundMethod
  public setPrevSelectionContainer(prevSelectionContainer: SelectionContainer | undefined): void {
    this.prevSelectionContainer = prevSelectionContainer;
  }

  /**
   * PageContainer 초기값을 생성해 반환합니다
   */
  @boundMethod
  public createPageContainer({
    startPageID,
    startPageURL,
  }: {
    startPageID: number;
    startPageURL: string;
  }): PageContainer {
    return new PageContainer({
      startPageID: startPageID || -1,
      startPageURL: startPageURL || '',
    });
  }

  /**
   * MetaDataContainer를 반환합니다
   */
  @boundMethod
  public getMetadataContainer(): MetadataContainer {
    return this.metadataContainer;
  }

  /**
   * EditorUIStore
   */
  @boundMethod
  public getEditorUIStore(): EditorUIStore {
    return this.editorUIStore;
  }

  /**
   * editingPageRefPosition 값 셋팅.
   */
  @action
  public setEditingPageRefPosition(pageRefPosition: PageRefPosition) {
    this.pageRefPosition = pageRefPosition;
  }

  /**
   * editingPageRefPosition 값을 가져옴.
   */
  public getEditingPageRefPosition() {
    return this.pageRefPosition;
  }
}
