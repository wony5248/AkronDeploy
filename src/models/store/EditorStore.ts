import { createContext } from 'react';
import CommandProps from './command/common/CommandProps';
import { action, runInAction } from 'mobx';
import CommandManager from './command/common/CommandManager';
import SelectionManager from 'models/store/selection/SelectionManager';
import EditorUIStore from 'store/app/EditorUIStore';
import TooltipStore from 'store/tooltip/TooltipStore';
import WidgetLayerContainer from 'models/widget/WidgetLayerContainer';
import WidgetCommandProps from 'models/store/command/widget/WidgetCommandProps';
import AppModeContainer, { AppModeType } from 'models/store/container/AppModeContainer';
import AppModel from 'models/node/AppModel';
import ContextMenuContainer from 'store/context-menu/ContextMenuContainer';
import AkronContext from 'models/store/context/AkronContext';
import EventState from 'models/store/event/EventState';
import { LeftToolPaneType } from 'store/toolpane/ToolPaneComponentInfo';
import { Nullable } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { AppInfo } from 'store/app/AppInfo';
import CompositeComponentContainer from 'models/store/container/CompositeComponentContainer';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import AppParser, { AppJson } from 'models/parser/AppParser';
import {
  MouseEvent,
  KeyEvent,
  FocusEvent,
  FormEvent,
  DragEvent,
  TouchEvent,
  PointerEvent,
  UIEvent,
  WheelEvent,
  AnimationEvent,
  ClipboardEvent,
  CompositionEvent,
} from '@akron/runner';
import AkronEventManager from 'models/store/event/AkronEventManager';
import AkronEventMapper from 'models/store/event/AkronEventMapper';
import AkronCommandMapper from 'models/store/command/akron/AkronCommandMapper';
import PageModel from 'models/node/PageModel';
import MetadataContainer from 'models/store/container/MetadataContainer';
import { DialogContentType } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * Editor Store 생성자 파라미터 Interface 입니다.
 */
export interface EditorStoreInitParams {
  appId: number;
  eventMapper: AkronEventMapper;
  mode: AppModeType;
  appName: string;
  appModeContainer: AppModeContainer;
  metadataContainer: MetadataContainer;
  commandMapper: AkronCommandMapper;
  appJson: AppJson;
  appInfo: AppInfo;
  contextMenuContainer: ContextMenuContainer;
  activeLeftToolPaneType?: LeftToolPaneType;
  selectAtFirst: boolean;
  startPageURL?: string;
  startPageID?: number;
  startElementId: number;
}

export enum SaveState {
  SAVING,
  SAVE_ERROR,
  SAVE_COMPLETE,
  RESAVING,
  RESAVE_ERROR,
}

/**
 * Editor Page 내에서 사용될 전역 Store Class 입니다.
 * Editor Page를 렌더하기 위해 사용되는 모든 기능을 전반적으로 관리합니다.
 */
class EditorStore {
  protected ctx: AkronContext;

  private readonly eventManager: AkronEventManager;

  private readonly commandManager: CommandManager;

  private readonly selectionManager: SelectionManager;

  private saveTimerId: undefined | NodeJS.Timeout;

  private saveState: SaveState;

  protected editorUIStore: EditorUIStore;

  protected tooltipStore: TooltipStore;

  protected widgetLayerContainer: WidgetLayerContainer;

  /**
   * 생성자
   */
  constructor(params: EditorStoreInitParams) {
    const appParser = new AppParser(params.appJson, params.metadataContainer);
    const appModel = appParser.getAppModel();
    this.eventManager = new AkronEventManager(params.eventMapper);
    this.commandManager = new CommandManager(params.commandMapper);
    this.selectionManager = new SelectionManager();
    const appModeContainer = new AppModeContainer(params.mode);
    this.editorUIStore = new EditorUIStore();
    this.tooltipStore = new TooltipStore();
    this.widgetLayerContainer = new WidgetLayerContainer();
    let eventState = EventState.EDIT;
    (this.saveState = SaveState.SAVE_COMPLETE),
      (this.ctx = new AkronContext({
        appID: params.appId,
        appInfo: params.appInfo,
        newAppModel: appModel,
        eventState,
        appName: params.appName,
        contextMenuContainer: params.contextMenuContainer,
        metadataContainer: params.metadataContainer,
        startPageID: params.startPageID || -1,
        startPageURL: params.startPageURL || '',
        activeLeftToolPaneType: params.activeLeftToolPaneType,
        appModeContainer,
        compositeComponentContainer: new CompositeComponentContainer(),
        editorUIStore: this.editorUIStore,
        startElementId: appParser.getStartElementId(),
      }));
  }

  /**
   * ctx에 있는 EditorUIStore getter
   */
  public getEditorUIStore(): EditorUIStore {
    return this.editorUIStore;
  }

  /**
   * ctx에 있는 TooltipStore getter
   */
  public getTooltipStore(): TooltipStore {
    return this.tooltipStore;
  }

  /**
   * ctx에 있는 WidgetLayerContainer getter
   */
  public getWidgetLayerContainer(): WidgetLayerContainer {
    return this.widgetLayerContainer;
  }

  /**
   * 현재 appModel 반환.
   */
  public getAppModel(): AppModel | undefined {
    return this.ctx.getAppModel();
  }

  /**
   * MetadataContainer를 반환합니다.
   */
  public getMetadataContainer(): MetadataContainer {
    return this.ctx.getMetadataContainer();
  }

  /**
   * appID getter.
   */
  public getAppID() {
    return this.ctx.getAppID();
  }

  /**
   * SelectionContainer를 초기화합니다.
   */
  @boundMethod
  public initHitContainer(): void {
    this.ctx.getHitContainer().initHitContainer();
  }

  /**
   * 현재 선택된 widget들을 가져옴.
   */
  @boundMethod
  getSelectedWidgets() {
    return this.ctx.getSelectionContainer()?.getSelectedWidgets() ?? [];
  }

  /**
   * selectionContainer 반환.
   */
  @boundMethod
  getSelectionContainer() {
    return this.ctx.getSelectionContainer();
  }

  /**
   * 현재 편집 중인 페이지를 반환합니다.
   * (선택된 페이지들 중 마지막 페이지와 동일합니다.)
   */
  public getEditingPageModel(): Nullable<WidgetModel /*<IComponentCommonProperties, IPageWidgetProperties>*/> {
    return this.ctx.getSelectionContainer()?.getEditingPage();
  }

  /**
   * 현재 편집 중인 페이지를 반환합니다.
   * (선택된 페이지들 중 마지막 페이지와 동일합니다.)
   */
  public getCtx(): AkronContext {
    return this.ctx;
  }

  /**
   * editingPageRefPosition 값 셋팅.
   */
  @action
  public setEditingPageRefPosition(x: number, y: number, width: number, height: number) {
    this.ctx.setEditingPageRefPosition({ x, y, width, height });
  }

  /**
   * editingPageRefPosition 값을 가져옴.
   */
  public getEditingPageRefPosition() {
    return this.ctx.getEditingPageRefPosition();
  }

  /**
   * 파라미터로 받은 Page Widget이 선택된 Page인지 확인하여 반환하는 함수
   */
  public isSelectedThumbnail(pageModel: PageModel) {
    const selectionContainer = this.ctx.getSelectionContainer();
    if (selectionContainer === undefined) {
      return false;
    }
    const widgetModels = selectionContainer.getSelectedPages();

    return widgetModels.some(widgetModel => {
      return widgetModel === pageModel;
    });
  }

  /**
   * zoom Ratio 반환.
   *
   * @returns context의 zoom ratio.
   */
  public getZoomRatio(): number {
    return this.ctx.getZoomRatio();
  }

  /**
   * zoom Ratio set.
   */
  @action
  public setZoomRatio(zoomRatio: number) {
    this.ctx.setZoomRatio(zoomRatio);
  }

  /**
   * saveState getter
   */
  @boundMethod
  public getSaveState(): SaveState {
    return this.saveState;
  }

  /**
   * NeedSaveState setter
   */
  @boundMethod
  public setNeedSaveState(state: boolean): void {
    runInAction(() => {
      this.ctx.setNeedSaveState(state);
    });
  }

  /**
   * SaveState setter
   */
  @boundMethod
  public setSaveState(state: SaveState): void {
    this.saveState = state;
  }

  /**
   * 현재 EventState를 반환합니다.
   */
  public getEventState(): EventState {
    return this.ctx.getEventState();
  }

  /**
   * EventState를 변경합니다.
   */
  public setEventState(state: EventState): void {
    this.ctx.setEventState(state);
  }

  /**
   * WidgetEditInfoContainer 반환
   */
  @boundMethod
  public getWidgetEditInfoContainer() {
    return this.ctx.getWidgetEditInfoContainer();
  }

  /**
   * ctx에 있는 Dialog getter
   */
  @boundMethod
  public getDialog(): { dialogType: DialogContentType | undefined; dialogOpen: boolean } {
    return {
      dialogType: this.ctx.getDialogType(),
      dialogOpen: this.ctx.getDialogOpen(),
    };
  }

  /**
   * ctx에 있는 Dialog setter
   */
  @action.bound
  public setDialog(dialogType: DialogContentType | undefined, dialogOpen: boolean) {
    this.ctx.setDialogType(dialogType);
    this.ctx.setDialogOpen(dialogOpen);
  }

  /**
   * commandEvent를 처리합니다.
   */
  @action.bound
  public handleCommandEvent(commandProps: WidgetCommandProps): void {
    const ctx = this.ctx;
    this.initContext(commandProps);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    // this.updateProperties(this.ctx);
    this.saveApp();
  }

  /**
   * Mouse Click 이벤트를 처리합니다.
   */
  @boundMethod
  public handleClick(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onClick(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    // this.updateProperties(this.ctx);
    this.saveApp();
  }

  /**
   * Mouse Double Click 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDoubleClick(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDoubleClick(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    this.saveApp();
  }

  /**
   * Mouse Down 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseDown(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseDown(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    // this.updateProperties(this.ctx);
    this.saveApp();
  }

  /**
   * Mouse Move 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseMove(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseMove(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Mouse Out 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseOut(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseOut(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Mouse Over 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseOver(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseOver(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Mouse Up 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseUp(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseUp(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    // this.updateProperties(this.ctx);
    this.saveApp();
  }

  /**
   * MouseEnter 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseEnter(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseEnter(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * MouseLeave 이벤트를 처리합니다.
   */
  @boundMethod
  public handleMouseLeave(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseLeave(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Mouse Drag 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDrag(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDrag(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Drag Start 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDragStart(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDragStart(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Drag End 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDragEnd(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDragEnd(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Drag Enter 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDragEnter(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDragEnter(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   *  Drag  Leave 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDragLeave(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDragLeave(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   *  Drag Over 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDragOver(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDragOver(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   *  Scroll 이벤트를 처리합니다.
   */
  @boundMethod
  public handleScroll(event: UIEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onScroll(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Drop 이벤트를 처리합니다.
   */
  @boundMethod
  public handleDrop(event: DragEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onDrop(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Mouse Wheel 이벤트를 처리합니다.
   */
  @boundMethod
  public handleWheel(event: WheelEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onWheel(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * onChange 이벤트를 처리합니다.
   */
  @boundMethod
  public handleOnChange(event: FormEvent<WidgetModel>, eventParams: any[]): void {
    this.initContext();
    this.eventManager.onChange(event, this.ctx, eventParams);
    this.commandManager.execute(this.ctx);
  }

  /**
   * contextMenu 이벤트를 처리합니다.
   */
  @boundMethod
  public handleOnContextMenu(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onFormContextMenu(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Invalid 이벤트를 처리합니다.
   */
  @boundMethod
  public handleInvalid(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onInvalid(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Reset 이벤트를 처리합니다.
   */
  @boundMethod
  public handleReset(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onReset(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Search 이벤트를 처리합니다.
   */
  @boundMethod
  public handleSearch(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onSearch(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Select 이벤트를 처리합니다.
   */
  @boundMethod
  public handleSelect(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onSelect(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * submit 이벤트를 처리합니다.
   */
  @boundMethod
  public handleSubmit(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onSubmit(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * ContextMenu 이벤트를 처리합니다.
   */
  @boundMethod
  public handleContextMenu(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onContextMenu(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    this.saveApp();
  }

  /**
   * KeyDown 이벤트를 처리합니다.
   */
  @boundMethod
  public handleKeyDown(event: KeyEvent<WidgetModel>): void {
    if (event.isShiftDown() && event.getIsComposing()) {
      return; // temporary, 여기에서 분기 처리해도 되나..? -- sj
    }
    this.initContext();
    this.eventManager.onKeyDown(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    // this.updateProperties(this.ctx);
    this.saveApp();
  }

  /**
   * KeyPressed 이벤트를 처리합니다.
   */
  @boundMethod
  public handleKeyPressed(event: KeyEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onKeyPressed(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
    // this.updateProperties(this.ctx);
  }

  /**
   * KeyUp 이벤트를 처리합니다.
   */
  @boundMethod
  public handleKeyUp(event: KeyEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onKeyUp(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * CompositionUpdate 이벤트를 처리합니다.
   */
  @boundMethod
  public handleCompositionUpdate(event: CompositionEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onCompositionUpdate(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.saveApp();
  }

  /**
   * BeforInput 이벤트를 처리합니다.
   */
  @boundMethod
  public handleBeforeInput(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onBeforeInput(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.saveApp();
  }

  /**
   * Input 이벤트를 처리합니다.
   */
  @boundMethod
  public handleInput(event: FormEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onInput(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Change 이벤트를 처리합니다.
   */
  @boundMethod
  public handleChange(event: FormEvent<WidgetModel>, eventParams: any[]): void {
    this.initContext();
    this.eventManager.onChange(event, this.ctx, eventParams);
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.ctx);
  }

  /**
   * Focus 이벤트를 처리합니다.
   */
  @boundMethod
  public handleFocus(event: FocusEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onFocus(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Blur 이벤트를 처리합니다.
   */
  @boundMethod
  public handleBlur(event: FocusEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onBlur(event, this.ctx);
    this.commandManager.execute(this.ctx);
    this.saveApp();
  }

  /**
   * Copy 이벤트를 처리합니다.
   */
  @boundMethod
  public handleCopy(event: ClipboardEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onCopy(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Cut 이벤트를 처리합니다.
   */
  @boundMethod
  public handleCut(event: ClipboardEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onCut(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Paste 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePaste(event: ClipboardEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPaste(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Touch start 이벤트를 처리합니다.
   */
  @boundMethod
  public handleTouchStart(event: TouchEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onTouchStart(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Touch end 이벤트를 처리합니다.
   */
  @boundMethod
  public handleTouchEnd(event: TouchEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onTouchEnd(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Touch Move 이벤트를 처리합니다.
   */
  @boundMethod
  public handleTouchMove(event: TouchEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onTouchMove(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Down 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerDown(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerDown(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Move 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerMove(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerMove(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Up 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerUp(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerUp(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Cancel 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerCancel(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerCancel(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Enter 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerEnter(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerEnter(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Leave 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerLeave(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerLeave(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Pointer Over 이벤트를 처리합니다.
   */
  @boundMethod
  public handlePointerOver(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onPointerOver(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Got Pointer Capture 이벤트를 처리합니다.
   */
  @boundMethod
  public handleGotPointerCapture(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onGotPointerCapture(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Lost Pointer Capture 이벤트를 처리합니다.
   */
  @boundMethod
  public handleLostPointerCapture(event: PointerEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onLostPointerCapture(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Animation Start 이벤트를 처리합니다.
   */
  @boundMethod
  public handleAnimationStart(event: AnimationEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onAnimationStart(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Animation End 이벤트를 처리합니다.
   */
  @boundMethod
  public handleAnimationEnd(event: AnimationEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onAnimationEnd(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Animation Iteration 이벤트를 처리합니다.
   */
  @boundMethod
  public handleAnimationIteration(event: AnimationEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onAnimationIteration(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * 문서에 변경 사항이 생길 경우 0.5초마다 자동 저장하는 핸들러
   */
  @boundMethod
  public handleSave(commandProps: WidgetCommandProps): void {
    this.initContext(commandProps);
    this.commandManager.execute(this.ctx);
    this.saveTimerId = undefined;
  }

  /**
   * Capture 시점에는 SelectionContainer의 HitItem을 채웁니다.
   */
  @boundMethod
  public handleMouseDownCapture(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseDownCapture(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Capture 시점에는 SelectionContainer의 HitItem을 채웁니다.
   */
  @boundMethod
  public handleMouseUpCapture(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseUpCapture(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * Capture 시점에는 SelectionContainer의 HitItem을 채웁니다.
   */
  @boundMethod
  public handleMouseMoveCapture(event: MouseEvent<WidgetModel>): void {
    this.initContext();
    this.eventManager.onMouseMoveCapture(event, this.ctx);
    this.commandManager.execute(this.ctx);
  }

  /**
   * updateMessage를 전송합니다.
   */
  @boundMethod
  public sendUpdateMessage(): void {
    const updateMessageContainer = this.ctx.getUpdateMessageContainer();

    if (this.saveTimerId) {
      clearTimeout(this.saveTimerId);
      updateMessageContainer.setTransformed(false);
    }

    if (
      !updateMessageContainer.getTransformed() &&
      (updateMessageContainer.hasMessage() || updateMessageContainer.getAPIMessages().length > 0) // length api 뚫기
    ) {
      if (this.getSaveState() === SaveState.SAVE_COMPLETE) {
        updateMessageContainer.setTransformed(true);
        this.saveTimerId = setTimeout(() => {
          this.setSaveState(SaveState.SAVING);
          this.handleSave({ commandID: CommandEnum.SAVE });
        }, 500);
      } else {
        this.setNeedSaveState(true);
      }
    }
  }

  /**
   * updateMessage를 생성합니다.
   */
  public makeUpdateMessage(): void {
    const command = this.ctx.getCommand();
    const commandProps = this.ctx.getCommandProps();
    const updateMessageContainer = this.ctx.getUpdateMessageContainer();
    if (updateMessageContainer === undefined || command === undefined || commandProps === undefined) {
      return;
    }

    let updateMessages = command.makeApplyUpdateMessages();
    switch (commandProps.commandID) {
      case CommandEnum.UNDO:
        updateMessages = command.makeUnApplyUpdateMessages();
        break;
      case CommandEnum.REDO:
        updateMessages = command.makeReApplyUpdateMessages();
        break;
      default:
        updateMessages = command.makeApplyUpdateMessages();
        break;
    }
    this.appendServerMessage(this.ctx);
    if (updateMessages.length === 0) {
      return;
    }

    updateMessageContainer.appendUpdateMessages(updateMessages);
  }

  /**
   * serverMessage를 처리합니다.
   */
  private async appendServerMessage(ctx: AkronContext): Promise<void> {
    const command = this.ctx.getCommand();
    const commandProps = this.ctx.getCommandProps();
    const updateMessageContainer = this.ctx.getUpdateMessageContainer();
    if (command === undefined || commandProps === undefined) {
      return;
    }
    let serverMessages;
    switch (commandProps.commandID) {
      case CommandEnum.UNDO:
        serverMessages = command.makeUnApplyMessages();
        break;
      case CommandEnum.REDO:
        serverMessages = command.makeReApplyMessages();
        break;
      default:
        serverMessages = command.makeApplyMessages();
        break;
    }
    for (let i = 0; i < serverMessages.length; i += 1) {
      updateMessageContainer.appendApiMessage(serverMessages[i]);
    }
  }

  /**
   * App의 변경 사항을 메시지로 만들어 서버로 보냅니다.
   */
  @boundMethod
  private saveApp(): void {
    // 1. Update message
    this.makeUpdateMessage();

    // 2. Send to server
    this.sendUpdateMessage();
  }

  /**
   * Event 시작 전 휘발성이 있는 context 를 초기화 합니다.
   */
  private initContext(commandProps?: CommandProps): void {
    this.ctx.setCommandProps(commandProps);
    this.ctx.setCommand(undefined);
  }
}

/**
 * Editor Store의 값을 component들에게 뿌려주는 context.
 */
export const EditorStoreContext = createContext<EditorStore>({} as EditorStore);

/**
 * Editor Store Context의 provider component.
 */
export const EditorStoreProvider = EditorStoreContext.Provider;

export default EditorStore;
