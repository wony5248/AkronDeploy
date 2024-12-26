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
import { BaseWidgetModel } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { AppInfo } from 'store/app/AppInfo';
import CompositeComponentContainer from 'models/store/container/CompositeComponentContainer';

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

/**
 * Editor Page 내에서 사용될 전역 Store Class 입니다.
 * Editor Page를 렌더하기 위해 사용되는 모든 기능을 전반적으로 관리합니다.
 */
class EditorStore {
  protected ctx: AkronContext;

  private readonly eventManager: AkronEventManager;

  private readonly commandManager: CommandManager;

  private readonly selectionManager: SelectionManager;

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
    let eventState = EventState.DEFAULT;
    this.ctx = new AkronContext({
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
    });
    this.editorUIStore = new EditorUIStore();
    this.tooltipStore = new TooltipStore();
    this.widgetLayerContainer = new WidgetLayerContainer();
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
   * 현재 선택된 widget들을 가져옴.
   */
  @boundMethod
  getSelectedWidgets() {
    return (this.getCtxAsAppContext().getSelectionContainer()?.getSelectedWidgets() as BaseWidgetModel[]) ?? [];
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
