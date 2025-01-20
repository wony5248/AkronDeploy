import { action, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { LeftToolPaneType, RightToolPaneType, ToolPaneData } from 'store/toolpane/ToolPaneComponentInfo';
import { IRibbonTab } from 'store/ribbon-menu/RibbonMenuComponentInfo';

export enum WorkAreaTabIndex {
  EDITOR,
  DATA,
  OSOBJECT,
}

export enum DataTabIndex {
  VARIABLE_DATA,
  OBJECT_TYPE,
  PRESET_VARIABLE_DATA,
  EXTERNAL_API,
  REQUEST_SERVICE,
  MANAGE_SERVICE, // 서비스 요청, 관리 추후 통합
  CUSTOM_CODE,
  STATES_PROPS,
}

export enum OSobjectTabIndex {
  ADD_MANAGE_OS,
}

export enum ContentMode {
  LIST,
  EVENT,
}

/**
 * 편집 UI에서 여러 부분들이 공통으로 바라보는 상태들을 관리합니다.
 */
export default class EditorUIStore {
  @observable
  private isLogicToolpaneOpen: boolean;

  @observable
  private activeRightToolPaneType: RightToolPaneType | null;

  // 현재 활성화된 좌측 툴페인.
  @observable
  private activeLeftToolPaneType: LeftToolPaneType;

  // 트리 Rerender Flag
  @observable
  private treeRerenderFlag = false;

  // // Editor 영역에서 사용될 snackBar Msg
  @observable
  private snackbarMsg = '';

  @observable
  private toolPaneTabMap: Map<string, IRibbonTab> = new Map();

  // WorkArea 영역 내 탭 정보를 저장합니다.
  @observable
  private tabIndex = {
    workAreaTabIndex: WorkAreaTabIndex.EDITOR,
    dataTabIndex: DataTabIndex.VARIABLE_DATA,
    OSobjectTabIndex: OSobjectTabIndex.ADD_MANAGE_OS,
  };

  /**
   * 생성자.
   */
  constructor() {
    makeObservable(this);
    this.activeRightToolPaneType = 'Design';
    this.isLogicToolpaneOpen = false;
    this.activeLeftToolPaneType = 'None';
    ToolPaneData.forEach(tab => {
      this.toolPaneTabMap.set(tab.id, tab);
    });
  }

  /**
   * 활성화된 툴페인 타입을 반환하는 함수
   */
  getActiveRightToolPaneType(): RightToolPaneType | null {
    return this.activeRightToolPaneType;
  }

  /**
   * 활성화된 툴페인 타입을 세팅하는 함수
   */
  @action.bound
  setActiveRightToolPaneType(type: RightToolPaneType | null) {
    this.activeRightToolPaneType = type;
  }

  /**
   * getActiveLeftToolPaneType.
   */
  getActiveLeftToolPaneType(): LeftToolPaneType {
    return this.activeLeftToolPaneType;
  }

  /**
   * setActiveLeftToolPaneType.
   */
  @action.bound
  setActiveLeftToolPaneType(activeLeftToolPaneType: LeftToolPaneType) {
    this.activeLeftToolPaneType = activeLeftToolPaneType;
  }

  /**
   * getIsOpenLogicToolpane
   */
  getIsLogicToolpaneOpen(): boolean {
    return this.isLogicToolpaneOpen;
  }

  /**
   * setIsOpenLogicToolpane
   */
  @action
  setIsLogicToolpaneOpen(isOpen: boolean) {
    this.isLogicToolpaneOpen = isOpen;
  }

  /*
   * rerender tree
   */
  @action
  treeRerender() {
    this.treeRerenderFlag = !this.treeRerenderFlag;
  }

  /**
   * get treeRerenderFlag
   */
  @boundMethod
  getTreeRerenderFlag() {
    return this.treeRerenderFlag;
  }

  /**
   * set snackbarMsg
   */
  @action
  setEditorSnackBarMsg(msg: string) {
    this.snackbarMsg = msg;
  }

  /**
   * get snackbarMsg
   */
  @boundMethod
  getEditorSnackBarMsg() {
    return this.snackbarMsg;
  }

  /**
   * ToolPane 탭을 가져옴.
   */
  public getToolPaneTabItem(id: string) {
    return this.toolPaneTabMap.get(id);
  }

  /**
   * WorkArea의 탭 정보를 반환합니다
   */
  @boundMethod
  public getWorkAreaTabIndex(): WorkAreaTabIndex {
    return this.tabIndex.workAreaTabIndex;
  }

  /**
   * WorkArea의 탭 정보를 설정합니다
   */
  @action
  public setWorkAreaTabIndex(index: WorkAreaTabIndex): void {
    this.tabIndex.workAreaTabIndex = index;
  }

  /**
   * Data 탭의 정보를 반환합니다
   */
  @boundMethod
  public getDataTabIndex(): DataTabIndex {
    return this.tabIndex.dataTabIndex;
  }

  /**
   * Data 탭 정보를 설정합니다
   */
  @action
  public setDataTabIndex(index: DataTabIndex): void {
    this.tabIndex.dataTabIndex = index;
  }
}
