import EventManager, { AkronEventManager } from './event/EventManager';
import { AkronEventMapper } from './event/EventMapper';
import { createContext } from 'react';
import { AkronCommandMapper } from './command/common/CommandMapper';
import CommandProps from './command/common/CommandProps';
import { action, runInAction } from 'mobx';
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
import { BaseWidgetModel, isUndefined, Nullable } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { AppInfo } from 'store/app/AppInfo';
import CompositeComponentContainer from 'models/store/container/CompositeComponentContainer';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';

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

  private saveTimerId: undefined | NodeJS.Timeout;

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
    this.commandManager.execute(this.ctx);
    this.selectionManager.updateSelection(this.getCtxAsAppContext());
    // this.updateProperties(this.getCtxAsAppContext());
    this.saveApp();
  }

  /**
   * 문서에 변경 사항이 생길 경우 0.5초마다 자동 저장하는 핸들러
   */
  @boundMethod
  public handleSave(commandProps: WidgetCommandProps): void {
    this.initContext(commandProps);
    this.commandManager.execute(this.getCtxAsAppContext());
    this.saveTimerId = undefined;
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
   * NeedSaveState setter
   */
  @boundMethod
  public setNeedSaveState(state: boolean): void {
    runInAction(() => {
      this.getCtxAsAppContext().setNeedSaveState(state);
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
   * updateMessage를 전송합니다.
   */
  @boundMethod
  public sendUpdateMessage(): void {
    const ctx = this.getCtxAsAppContext();
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

        this.saveTimerId = global.setTimeout(() => {
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
    const updateMessageContainer = this.ctx;
    if (isUndefined(updateMessageContainer) || command === undefined || commandProps === undefined) {
      return;
    }

    // let updateMessages = command.make();
    // switch (commandProps.commandID) {
    //   case CommandEnum.UNDO:
    //     updateMessages = command.();
    //     break;
    //   case CommandEnum.REDO:
    //     updateMessages = command.makeReApplyUpdateMessages();
    //     break;
    //   default:
    //     updateMessages = command.makeApplyUpdateMessages();
    //     break;
    // }
    // this.appendServerMessage(this.getCtxAsAppContext());
    // if (updateMessages.length === 0) {
    //   return;
    // }

    // const ctxAs = this.getCtxAsAppContext();
    // const id = ctxAs.appID;

    // updateMessageContainer.appendUpdateMessages(updateMessages, id);
  }

  /**
   * App의 변경 사항을 메시지로 만들어 서버로 보냅니다.
   */
  @boundMethod
  private saveApp(): void {
    // if (!(this.ctx.getSaveState() === SaveState.SAVE_ERROR || this.ctx.getSaveState() === SaveState.RESAVE_ERROR)) {
    //   AppRepositorySAS.sendUpdateMessage(this.ctx).then(result => {
    //     runInAction(() => {
    //       // eslint-disable-next-line no-empty
    //       if (result === 'nonUpdate') {
    //       } else if (result === 'updateError') {
    //         if (this.ctx.getSaveState() === SaveState.RESAVING) {
    //           this.ctx.setSaveState(SaveState.RESAVE_ERROR);
    //         } else {
    //           this.ctx.setSaveState(SaveState.SAVE_ERROR);
    //         }
    //       } else if (result === 'updateComplete') {
    //         this.ctx.setSaveState(SaveState.SAVE_COMPLETE);
    //         const resetDate = new Date();
    //         this.ctx.setLastSavedTime(resetDate);
    //         if (this.ctx.getNeedSaveState()) {
    //           this.ctx.setSaveState(SaveState.SAVING);
    //           this.saveApp(this.ctx);
    //         }
    //       }
    //     });
    //   });
    // }
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
