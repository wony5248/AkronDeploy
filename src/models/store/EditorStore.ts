import EventManager, { AkronEventManager } from './event/EventManager';
import { AkronEventMapper } from './event/EventMapper';
import { createContext } from 'react';
import { AkronCommandMapper } from './command/common/CommandMapper';
import CommandEnum from './command/common/CommandEnum';
import CommandProps, { SelectionProp } from './command/common/CommandProps';
import { action } from 'mobx';
import CommandManager, { AkronCommandManager } from './command/common/CommandManager';
import AkronContext from 'models/store/context/AkronContext';
import AppContextBase from 'models/store/context/ContextBase';
import SelectionManager from 'models/store/selection/SelectionManager';
import EditorUIStore from 'store/app/EditorUIStore';
import TooltipStore from 'store/tooltip/TooltipStore';

/**
 * Editor Store 생성자 파라미터 Interface 입니다.
 */
export interface EditorStoreInitParams {
  // widgetID, commandEnum, SelectionProp, WidgetModel
  eventMapper: AkronEventMapper;
  // WidgetID, CommandEnum, SelectionProp
  commandMapper: AkronCommandMapper;
}

/**
 * Editor Page 내에서 사용될 전역 Store Class 입니다.
 * Editor Page를 렌더하기 위해 사용되는 모든 기능을 전반적으로 관리합니다.
 */
class EditorStore {
  protected ctx: AppContextBase;

  private readonly eventManager: AkronEventManager;

  private readonly commandManager: AkronCommandManager;

  private readonly selectionManager: SelectionManager;

  protected editorUIStore: EditorUIStore;

  protected tooltipStore: TooltipStore;
  /**
   * 생성자
   */
  constructor(params: EditorStoreInitParams) {
    this.eventManager = new EventManager(params.eventMapper);
    this.commandManager = new CommandManager(params.commandMapper);
    this.selectionManager = new SelectionManager();
    this.ctx = {
      appID: 100,
    };
    this.editorUIStore = new EditorUIStore({
      // customPropertyContentRenderer: args.customPropertyContentRenderer,
      // activeLeftToolPaneType: args.activeLeftToolPaneType,
    });
    this.tooltipStore = new TooltipStore();
  }

  /**
   * commandEvent를 처리합니다.
   */
  @action.bound
  public handleCommandEvent(commandProps: CommandProps<CommandEnum, SelectionProp>): void {
    this.initContext(commandProps);
    this.commandManager.execute(this.getCtxAsAppContext());
    this.selectionManager.updateSelection(this.getCtxAsAppContext());
    // this.updateProperties(this.getCtxAsAppContext());
    // this.saveApp();
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
  private initContext(commandProps?: CommandProps<CommandEnum, SelectionProp>): void {
    this.getCtxAsAppContext().commandProps = commandProps;
    this.getCtxAsAppContext().command = undefined;
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
