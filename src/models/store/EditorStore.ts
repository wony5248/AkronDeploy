import EventManager, { AkronEventManager } from './event/EventManager';
import { AkronEventMapper } from './event/EventMapper';
import { createContext } from 'react';
import { AkronCommandMapper } from './command/common/CommandMapper';
import CommandProps from './command/common/CommandProps';
import { action } from 'mobx';
import CommandManager from './command/common/CommandManager';
import SelectionManager from 'models/store/selection/SelectionManager';
import EditorUIStore from 'store/app/EditorUIStore';
import TooltipStore from 'store/tooltip/TooltipStore';
import WidgetLayerContainer from 'models/widget/WidgetLayerContainer';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AppModeContainer, { AppModeType } from 'models/store/container/AppModeContainer';
import AppModel from 'models/node/AppModel';
import ContextMenuContainer from 'store/context-menu/ContextMenuContainer';
import AkronContext from 'models/store/context/AkronContext';
import EventState from 'models/store/event/EventState';
import { LeftToolPaneType } from 'store/toolpane/ToolPaneComponentInfo';
import { BaseWidgetModel, Nullable } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { AppInfo } from 'store/app/AppInfo';
import CompositeComponentContainer from 'models/store/container/CompositeComponentContainer';
import WidgetModel from 'models/node/WidgetModel';

/**
 * Editor Store 생성자 파라미터 Interface 입니다.
 */
export interface EditorStoreInitParams {
  eventMapper: AkronEventMapper;
  mode: AppModeType;
  appName: string;
  appModeContainer: AppModeContainer;
  commandMapper: AkronCommandMapper;
  appID: number;
  contextMenuContainer: ContextMenuContainer;
  activeLeftToolPaneType?: LeftToolPaneType;
  selectAtFirst: boolean;
  startPageURL?: string;
  startPageID?: number;
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

  private saveState: SaveState;

  protected editorUIStore: EditorUIStore;

  protected tooltipStore: TooltipStore;

  protected widgetLayerContainer: WidgetLayerContainer;
  /**
   * 생성자
   */
  constructor(
    params: EditorStoreInitParams & {
      appModel: AppModel;
      appInfo: AppInfo;
      compositeComponentContainer: CompositeComponentContainer;
    }
  ) {
    this.eventManager = new EventManager(params.eventMapper);
    this.commandManager = new CommandManager(params.commandMapper);
    this.selectionManager = new SelectionManager();
    const appModeContainer = new AppModeContainer(params.mode);
    this.editorUIStore = new EditorUIStore();
    this.tooltipStore = new TooltipStore();
    this.widgetLayerContainer = new WidgetLayerContainer();
    let eventState = EventState.DEFAULT;
    (this.saveState = SaveState.SAVE_COMPLETE),
      (this.ctx = new AkronContext({
        appID: params.appID,
        appInfo: params.appInfo,
        newAppModel: params.appModel,
        eventState,
        appName: params.appName,
        contextMenuContainer: params.contextMenuContainer,
        startPageID: params.startPageID || -1,
        startPageURL: params.startPageURL || '',
        activeLeftToolPaneType: params.activeLeftToolPaneType,
        appModeContainer,
        compositeComponentContainer: params.compositeComponentContainer,
        editorUIStore: this.editorUIStore,
      }));
  }

  /**
   * commandEvent를 처리합니다.
   */
  @action.bound
  public handleCommandEvent(commandProps: WidgetCommandProps): void {
    const ctx = this.getCtxAsAppContext();
    this.initContext(commandProps);
    this.commandManager.execute(ctx);
    this.selectionManager.updateSelection(this.getCtxAsAppContext());
    // this.updateProperties(this.getCtxAsAppContext());
    // this.saveApp();
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
    return this.ctx.getNewAppModel();
  }

  /**
   * 현재 선택된 widget들을 가져옴.
   */
  @boundMethod
  getSelectedWidgets() {
    return (this.getCtxAsAppContext().getSelectionContainer()?.getSelectedWidgets() as BaseWidgetModel[]) ?? [];
  }

  /**
   * 현재 수정중인 widget model을 반환합니다.
   *
   * @returns 현재 모드에 따라 수정중인 widget model 반환 (EDIT_APP 모드에서는 AppWidgetModel 반환)
   */
  public getEditingWidgetModel() {
    return this.getCtxAsAppContext().getEditingWidgetModel();
  }

  /**
   * 현재 편집 중인 페이지를 반환합니다.
   * (선택된 페이지들 중 마지막 페이지와 동일합니다.)
   */
  public getEditingPageModel(): Nullable<WidgetModel /*<IComponentCommonProperties, IPageWidgetProperties>*/> {
    return this.getCtxAsAppContext().getSelectionContainer()?.getEditingPage();
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
    this.getCtxAsAppContext().setEditingPageRefPosition({ x, y, width, height });
  }

  /**
   * editingPageRefPosition 값을 가져옴.
   */
  public getEditingPageRefPosition() {
    return this.getCtxAsAppContext().getEditingPageRefPosition();
  }

  /**
   * zoom Ratio 반환.
   *
   * @returns context의 zoom ratio.
   */
  public getZoomRatio(): number {
    return this.getCtxAsAppContext().getZoomRatio();
  }

  /**
   * zoom Ratio set.
   */
  @action
  public setZoomRatio(zoomRatio: number) {
    this.getCtxAsAppContext().setZoomRatio(zoomRatio);
  }

  /**
   * saveState getter
   */
  @boundMethod
  public getSaveState(): SaveState {
    return this.saveState;
  }

  /**
   * SaveState setter
   */
  @boundMethod
  public setSaveState(state: SaveState): void {
    this.saveState = state;
  }

  /**
   * this.ctx가 RuntimeStore를 상속받기 때문에 AppContextBase이다.
   * 하지만 AppStore에서는 constructor에서 this.ctx를 AppContext로 정의하고 있기 때문에
   * 타입 단언(as)를 통해 AppContext로 정의해야 AppContext의 기능을 사용할 수 있다.
   */
  private getCtxAsAppContext() {
    return this.ctx as AkronContext;
  }

  /**
   * Event 시작 전 휘발성이 있는 context 를 초기화 합니다.
   */
  private initContext(commandProps?: CommandProps): void {
    this.getCtxAsAppContext().setCommandProps(commandProps);
    this.getCtxAsAppContext().setCommand(undefined);
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
