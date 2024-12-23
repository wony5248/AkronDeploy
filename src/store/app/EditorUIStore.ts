import { action, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { LeftToolPaneType, RightToolPaneType } from 'store/toolpane/ToolPaneComponentInfo';

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
  // Content 툴페인에 원하는 속성 UI를 렌더링하는 함수.
  // 여기서 **null을 반환할 경우** 기본 UI가 렌더링됩니다.
  // private customPropertyContentRenderer: WidgetPropertyContentRenderer;

  // 현재 활성화된 툴페인 및 그 상태.
  // (null: 활성화된 툴페인이 없음.)
  @observable
  private activeRightToolPaneType: RightToolPaneType | null;
  //   @observable
  // private selectedServiceComponent: ServiceComponentModel | ExternalServiceModel | null;

  // // 현재 활성화된 좌측 툴페인.
  @observable
  private activeLeftToolPaneType: LeftToolPaneType;

  // // 트리 Rerender Flag
  //   @observable
  // treeRerenderFlag: boolean = false;

  // // Editor 영역에서 사용될 snackBar Msg
  @observable
  private snackbarMsg = '';
  //   @observable
  // private businessAlertOpenProperty: boolean;
  //   @observable
  // private businessAlertTitle: string = '';
  //   @observable
  // private businessAlertContent: ReactNode;

  // private iconTabTheme: string;

  // private iconTabSize: number;

  // private iconTabColor: string;
  //   @observable
  // private OSobjectType: OSobjectWidgetType | undefined;

  // private OSobjectText: string;

  // private OSobjectName: string;

  // private OSobjectPropArray: OSobjectPropertyType[];

  // private deleteOSobjectID: number;

  // // 어떤 탭에서 Make OSobject 탭으로 왔는지
  // // OSobject 수정을 통해 들어온 경우 OSOBJECT
  // private makeOSobjectFrom: WorkAreaTabIndex;

  // // 마지막 편집 step 저장, 임시 저장 데이터 없을 경우 null
  // private saveDraftStep: number | null;

  // // 수정 중이거나 생성 중인 OSobject
  // private editOSobject: OSobjectModel | undefined;

  // // OS객체 로직 설정 시 최종 완료 때 수행하기 위한 CommandProps 목록
  // private insertBusinessLogicCommandProps: InsertBusinessLogicCommandProps | null;

  // // DX 서비스 요청 페이지의 화면 전환을 위함
  //   @observable
  // public contentMode: ContentMode;

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

    // this.customPropertyContentRenderer = args.customPropertyContentRenderer ?? (() => null);

    this.activeRightToolPaneType = 'Design';
    // this.selectedServiceComponent = null;
    this.activeLeftToolPaneType = 'None'; // args.activeLeftToolPaneType || 'None';

    // this.businessAlertOpenProperty = false;
    // this.businessAlertContent = '';

    // this.iconTabTheme = 'Outlined';
    // this.iconTabSize = 24;
    // this.iconTabColor = '';

    // this.OSobjectType = undefined;
    // this.OSobjectText = '';
    // this.OSobjectName = '';
    // this.OSobjectPropArray = [];
    // this.deleteOSobjectID = -1;
    // this.makeOSobjectFrom = WorkAreaTabIndex.EDITOR;
    // this.saveDraftStep = null;
    // this.editOSobject = undefined;
    // this.insertBusinessLogicCommandProps = null;
    // this.contentMode = ContentMode.LIST;
  }

  // /**
  //  * Content UI renderer getter.
  //  */
  // getCustomPropertyContentRenderer() {
  //     return this.customPropertyContentRenderer;
  // }

  // /**
  //  * getter of selectedServiceComponent
  //  *
  //  * @returns this.selectedServiceComponent
  //  */
  // getSelectedServiceComponent(): ServiceComponentModel | ExternalServiceModel | null {
  //     return this.selectedServiceComponent;
  // }

  // /**
  //  * setter of selectedServiceComponent
  //  */
  // setSelectedServiceComponent(serviceComponent: ServiceComponentModel | ExternalServiceModel | null) {
  //     this.selectedServiceComponent = serviceComponent;
  // }

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

  // /**
  //  * rerender tree
  //  */
  //   @action
  // treeRerender() {
  //     this.treeRerenderFlag = !this.treeRerenderFlag;
  // }

  // /**
  //  * get treeRerenderFlag
  //  */
  //   @boundMethod
  // getTreeRerenderFlag() {
  //     return this.treeRerenderFlag;
  // }

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

  // /**
  //  * get business alert component open/close render option
  //  */
  // getBusinessAlertOpenProperty(): boolean {
  //     return this.businessAlertOpenProperty;
  // }

  // /**
  //  * set business alert component open/close render option
  //  */
  //   @action.bound
  // setBusinessAlertOpenProperty(alertOpenProperty: boolean): void {
  //     this.businessAlertOpenProperty = alertOpenProperty;
  // }

  // /**
  //  * set business alert title
  //  */
  //   @action.bound
  // setBusinessAlertTitle(data: string): void {
  //     this.businessAlertTitle = data;
  // }

  // /**
  //  * get business alert title
  //  */
  // getBusinessAlertTitle() {
  //     return this.businessAlertTitle;
  // }

  // /**
  //  * set business alert string data
  //  * show alert message  by this.businessAlertString
  //  */
  //   @action.bound
  // setBusinessAlertContent(data: ReactNode): void {
  //     this.businessAlertContent = data;
  // }

  // /**
  //  * get business alert string data
  //  */
  // getBusinessAlertContent(): ReactNode {
  //     return this.businessAlertContent;
  // }

  // /**
  //  * getIconTabTheme
  //  */
  // getIconTabTheme(): string {
  //     return this.iconTabTheme;
  // }

  // /**
  //  * setIconTabTheme
  //  */
  // setIconTabTheme(iconTabTheme: string) {
  //     this.iconTabTheme = iconTabTheme;
  // }

  // /**
  //  * getIconTabSize
  //  */
  // getIconTabSize(): number {
  //     return this.iconTabSize;
  // }

  // /**
  //  * setIconTabSize
  //  */
  // setIconTabSize(iconTabSize: number) {
  //     this.iconTabSize = iconTabSize;
  // }

  // /**
  //  * getIconTabColor
  //  */
  // getIconTabColor(): string {
  //     return this.iconTabColor;
  // }

  // /**
  //  * setIconTabColor
  //  */
  // setIconTabColor(iconTabColor: string) {
  //     this.iconTabColor = iconTabColor;
  // }

  // /**
  //  * getOSobjectType.
  //  */
  //   @boundMethod
  // getOSobjectType(): OSobjectWidgetType | undefined {
  //     return this.OSobjectType;
  // }

  // /**
  //  * setOSobjectType.
  //  */
  //   @action
  // setOSobjectType(OSobjectType: OSobjectWidgetType | undefined) {
  //     this.OSobjectType = OSobjectType;
  // }

  // /**
  //  * getOSobjectText.
  //  */
  // getOSobjectText(): string {
  //     return this.OSobjectText;
  // }

  // /**
  //  * setOSobjectText.
  //  */
  // setOSobjectText(OSobjectText: string) {
  //     this.OSobjectText = OSobjectText;
  // }

  // /**
  //  * getOSobjectName.
  //  */
  // getOSobjectName(): string {
  //     return this.OSobjectName;
  // }

  // /**
  //  * setOSobjectName.
  //  */
  // setOSobjectName(OSobjectName: string) {
  //     this.OSobjectName = OSobjectName;
  // }

  // /**
  //  * getOSobjectProp
  //  */
  // getOSobjectProp(): OSobjectPropertyType[] {
  //     return this.OSobjectPropArray;
  // }

  // /**
  //  * setOSobjectProp
  //  */
  // setOSobjectProp(OSobjectPropArray: OSobjectPropertyType[]) {
  //     this.OSobjectPropArray = OSobjectPropArray;
  // }

  // /**
  //  * updateOSobjectProp
  //  */
  // updateOSobjectProp(index: number, value: NSB, type?: WidgetMetaDataControlType['type']): OSobjectPropertyType[] {
  //     const updateOSobjectPropMap = [...this.OSobjectPropArray];
  //     updateOSobjectPropMap[index] = {
  //         ...updateOSobjectPropMap[index],
  //         property: {
  //             ...updateOSobjectPropMap[index].property,
  //             value,
  //             control: {
  //                 ...updateOSobjectPropMap[index].property.control,
  //                 type: type || updateOSobjectPropMap[index].property.control.type,
  //             },
  //         },
  //     };

  //     this.OSobjectPropArray = updateOSobjectPropMap;
  //     return this.OSobjectPropArray;
  // }

  // /**
  //  * clearOSobject.
  //  */
  //   @action
  // clearOSobjectTab() {
  //     this.OSobjectType = undefined;
  //     this.OSobjectName = '';
  //     this.OSobjectText = '';
  //     this.OSobjectPropArray = [];
  //     this.makeOSobjectFrom = WorkAreaTabIndex.EDITOR;
  //     this.saveDraftStep = null;
  //     this.editOSobject = undefined;
  //     this.tabIndex = {
  //         workAreaTabIndex: WorkAreaTabIndex.EDITOR,
  //         dataTabIndex: DataTabIndex.VARIABLE_DATA,
  //         OSobjectTabIndex: OSobjectTabIndex.ADD_MANAGE_OS,
  //     };
  // }

  // /**
  //  * getDeleteOSobjectID.
  //  */
  // getDeleteOSobjectID(): number {
  //     return this.deleteOSobjectID;
  // }

  // /**
  //  * setDeleteOSobjectID.
  //  */
  // setDeleteOSobjectID(deleteOSobjectID: number) {
  //     this.deleteOSobjectID = deleteOSobjectID;
  // }

  // /**
  //  * makeOSobjectFrom
  //  */
  // getMakeOSobjectFrom(): WorkAreaTabIndex {
  //     return this.makeOSobjectFrom;
  // }

  // /**
  //  * makeOSobjectFrom
  //  */
  // setMakeOSobjectFrom(makeOSobjectFrom: WorkAreaTabIndex) {
  //     this.makeOSobjectFrom = makeOSobjectFrom;
  // }

  // /**
  //  * saveDraftStep
  //  */
  // getSaveDraftStep(): number | null {
  //     return this.saveDraftStep;
  // }

  // /**
  //  * saveDraftStep
  //  */
  // setSaveDraftStep(saveDraftStep: number | null) {
  //     this.saveDraftStep = saveDraftStep;
  // }

  // /**
  //  * getEditOSobjectID
  //  */
  // getEditOSobject(): OSobjectModel | undefined {
  //     return this.editOSobject;
  // }

  // /**
  //  * setEditOSobjectID
  //  */
  // setEditOSobject(editOSobject: OSobjectModel | undefined) {
  //     this.editOSobject = editOSobject;
  // }

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

  // /**
  //  * OSobject 탭의 정보를 반환합니다
  //  */
  // @boundMethod
  // public getOSobjectTabIndex(): OSobjectTabIndex {
  //     return this.tabIndex.OSobjectTabIndex;
  // }

  // /**
  //  * OSobject 탭 정보를 설정합니다
  //  */
  // @action
  // public setOSobjectTabIndex(index: OSobjectTabIndex): void {
  //     this.tabIndex.OSobjectTabIndex = index;
  // }

  // /**
  //  * getInsertBusinessLogicCommandPropsList
  //  */
  // getInsertBusinessLogicCommandProps(): InsertBusinessLogicCommandProps | null {
  //     return this.insertBusinessLogicCommandProps;
  // }

  // /**
  //  * setInsertBusinessLogicCommandProps
  //  */
  // setInsertBusinessLogicCommandProps(commandProps: InsertBusinessLogicCommandProps) {
  //     this.insertBusinessLogicCommandProps = commandProps;
  // }

  // /**
  //  * DX 서비스 요청 페이지의 content 모드 설정
  //  */
  // @action
  // public setContentMode(contentMode: ContentMode) {
  //     this.contentMode = contentMode;
  // }

  // /**
  //  * DX 서비스 요청 페이지의 content 모드 반환
  //  */
  // @boundMethod
  // public getContentMode(): ContentMode {
  //     return this.contentMode;
  // }

  // /**
  //  * OS Object Init Function
  //  */
  // @action
  // public initOSObject() {
  //     this.setMakeOSobjectFrom(WorkAreaTabIndex.EDITOR);
  //     this.setWorkAreaTabIndex(WorkAreaTabIndex.OSOBJECT);
  //     this.setSaveDraftStep(null);
  //     this.setOSobjectName('');
  //     this.setOSobjectType(undefined);
  //     this.setOSobjectText('');
  //     this.setOSobjectProp([]);
  //     this.setEditOSobject(undefined);
  // }
}
