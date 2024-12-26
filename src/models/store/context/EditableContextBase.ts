import { boundMethod } from 'autobind-decorator';
import { observable, makeObservable } from 'mobx';
import AppModel from 'models/node/AppModel';
import { WidgetID } from 'models/node/WidgetModel';
import { EditableContextBaseProp } from 'models/store/context/ContextTypes';
import { NavigateFunction } from 'react-router-dom';
import { AppInfo } from 'store/app/AppInfo';

/**
 * 현재 편집 중인 app의 정보 및 편집기의 상태들을 담고 있습니다.
 * AppStore는 command, event 등의 로직들을 현재의 AppContextBase 값 위에 정해진 순서대로 적용하는 형태로 작동합니다.
 * (CM/C (Component Manager / Component) 구조)
 */
class AppEditableContextBase {
  /**
   * Version 2 New App Model
   */
  @observable
  private newAppModel: AppModel;

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
   * Widget 생성에 필요한 정보들을 담고 있습니다.
   */
  // @observable
  // private newMetaDataContainer: NewMetaDataContainer;

  /**
   * 앱에서 쓰이는 스타일들에 대한 정보들을 담고 있습니다.
   */
  // @observable
  // private appStylesContainer: AppStylesContainer;

  /**
   * Business Component에 대한 정보를 담는 Container
   */
  // @observable
  // private businessContainer: BusinessContainerBase;

  /**
   * Event에 대한 정보를 담는 Container
   */
  // @observable
  // private newBusinessContainer: NewBusinessContainer;

  /**
   * Global Theme에 대한 정보를 담는 Container
   */
  // @observable
  // private globalThemeContainer: GlobalThemeContainer;

  /**
   * Component Theme에 대한 정보를 담는 Container
   */
  // @observable
  // private compThemeContainer: CompThemeContainer;

  /**
   * Composite Component에 대한 정보를 담는 Container
   */
  // @observable
  // private compositeComponentContainer: CompositeComponentContainer;

  /**
   * Global 변수(data)를 갖고 있는 data store입니다.
   */
  // @observable
  // private dataStore: DataStoreBase;

  /**
   * Custom Function 매핑 관리자
   */
  // @observable
  // private customFunctionStore: CustomFunctionStoreBase;

  /**
   * 서비스 매핑 관리자
   */
  // @observable
  // private serviceStore: ServiceStoreBase;

  /**
   * CMS 이벤트 핸들러 정보를 담고 있는 store
   */
  // @observable
  // private serviceHandlerStore: ServiceHandlerStoreBase;

  /**
   * 각종 data binding 정보를 담는 Container
   */
  // @observable
  // private dataBindingContainer: DataBindingContainer;

  /**
   * App내 UI로 표현되어야하는 Store
   */
  // @observable
  // private uiStore: UIStore;

  // @observable
  // private businessComponentServiceMapper: BusinessComponentServiceMapper;

  private navigateFunction?: NavigateFunction;

  /**
   * DrawingToolContainer
   */
  // private drawingToolContainer: DrawingToolContainer;

  /**
   * Event에 대한 정보를 담는 Container
   */
  // @observable
  // private newOSObjectContainer: NewOSObjectContainer;

  /**
   * OUTER 서비스 매핑 관리자
   */
  // @observable
  // private outerServiceStore: OuterServiceStoreBase;

  /**
   * 삽입된 스튜디오 컴포넌트들 정보 관리자
   */
  // @observable
  // private highLevelStudiosContainer: HighLevelStudiosContainer;

  /**
   * 생성자
   */
  constructor(initProp: EditableContextBaseProp) {
    makeObservable(this);

    this.newAppModel = initProp.newAppModel;
    this.appID = initProp.appID;
    this.appInfo = initProp.appInfo;
    // this.newMetaDataContainer = initProp.newMetaDataContainer;
    // this.appStylesContainer = initProp.appStylesContainer;
    // this.businessContainer = initProp.businessContainer;
    // this.newBusinessContainer = initProp.newBusinessContainer;
    // this.dataStore = initProp.dataStore;
    // this.customFunctionStore = initProp.customFunctionStore;
    // this.serviceStore = initProp.serviceStore;
    // this.serviceHandlerStore = initProp.serviceHandlerStore;
    // this.dataBindingContainer = initProp.dataBindingContainer;
    // this.uiStore = initProp.uiStore;
    // this.businessComponentServiceMapper = initProp.businessComponentServiceMapper;
    this.navigateFunction = initProp.navigateFunction;
    // this.drawingToolContainer = new DrawingToolContainer();
    // this.globalThemeContainer = initProp.globalThemeContainer;
    // this.compThemeContainer = initProp.compThemeContainer;
    // this.compositeComponentContainer = initProp.compositeComponentContainer;
    // this.newOSObjectContainer = initProp.newOSObjectContainer;
    // this.outerServiceStore = initProp.outerServiceStore;
    // this.highLevelStudiosContainer = initProp.highLevelStudiosContainer;
  }

  /**
   * newAppModel을 반환합니다
   */
  @boundMethod
  public getNewAppModel(): AppModel {
    return this.newAppModel;
  }

  /**
   * newAppModel을 설정합니다
   */
  @boundMethod
  public setNewAppModel(appModel: AppModel): void {
    this.newAppModel = appModel;
  }

  /**
   * AppID를 반환합니다
   */
  @boundMethod
  public getAppID(): WidgetID {
    return this.appID;
  }

  /**
   * AppID를 설정합니다
   */
  @boundMethod
  public setAppID(appID: WidgetID): void {
    this.appID = appID;
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
   * NewMetaDataContainer를 반환합니다
   */
  //   @boundMethod
  //   public getNewMetaDataContainer(): NewMetaDataContainer {
  //     return this.newMetaDataContainer;
  //   }

  //   /**
  //    * NewMetaDataContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setNewMetaDataContainer(newMetaDataContainer: NewMetaDataContainer): void {
  //     this.newMetaDataContainer = newMetaDataContainer;
  //   }

  /**
   * AppStylesContainer를 반환합니다
   */
  //   @boundMethod
  //   public getAppStylesContainer(): AppStylesContainer {
  //     return this.appStylesContainer;
  //   }

  //   /**
  //    * AppStylesContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setAppStylesContainer(appStylesContainer: AppStylesContainer): void {
  //     this.appStylesContainer = appStylesContainer;
  //   }

  //   /**
  //    * BusinessContainer를 반환합니다
  //    */
  //   @boundMethod
  //   public getBusinessContainer(): BusinessContainerBase {
  //     return this.businessContainer;
  //   }

  //   /**
  //    * BusinessContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setBusinessContainer(businessContainer: BusinessContainerBase): void {
  //     this.businessContainer = businessContainer;
  //   }

  //   /**
  //    * BusinessContainer를 반환합니다
  //    */
  //   @boundMethod
  //   public getNewBusinessContainer(): NewBusinessContainer {
  //     return this.newBusinessContainer;
  //   }

  //   /**
  //    * BusinessContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setNewBusinessContainer(newBusinessContainer: NewBusinessContainer): void {
  //     this.newBusinessContainer = newBusinessContainer;
  //   }

  //   /**
  //    * OSObjectContainer를 반환합니다
  //    */
  //   @boundMethod
  //   public getNewOSObjectContainer(): NewOSObjectContainer {
  //     return this.newOSObjectContainer;
  //   }

  //   /**
  //    * OSObjectContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setNewOSObjectContainer(newOSObjectContainer: NewOSObjectContainer): void {
  //     this.newOSObjectContainer = newOSObjectContainer;
  //   }

  //   /**
  //    * GlobalThemeContainer를 반환합니다
  //    */
  //   @boundMethod
  //   public getGlobalThemeContainer(): GlobalThemeContainer {
  //     return this.globalThemeContainer;
  //   }

  //   /**
  //    * GlobalThemeContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setGlobalThemeContainer(globalThemeContainer: GlobalThemeContainer): void {
  //     this.globalThemeContainer = globalThemeContainer;
  //   }

  //   /**
  //    * CompThemeContainer를 반환합니다
  //    */
  //   @boundMethod
  //   public getCompThemeContainer(): CompThemeContainer {
  //     return this.compThemeContainer;
  //   }

  //   /**
  //    * CompThemeContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setCompThemeContainer(compThemeContainer: CompThemeContainer): void {
  //     this.compThemeContainer = compThemeContainer;
  //   }

  //   /**
  //    * CompositeComponentContainer 반환합니다
  //    */
  //   @boundMethod
  //   public getCompositeComponentContainer(): CompositeComponentContainer {
  //     return this.compositeComponentContainer;
  //   }

  //   /**
  //    * CompositeComponentContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setCompositeComponentContainer(compositeComponentContainer: CompositeComponentContainer): void {
  //     this.compositeComponentContainer = compositeComponentContainer;
  //   }

  //   /**
  //    * OUTER 서비스 매핑 관리자 반환
  //    */
  //   @boundMethod
  //   public getOuterServiceStore(): OuterServiceStoreBase {
  //     return this.outerServiceStore;
  //   }

  //   /**
  //    * OUTER 서비스 매핑 관리자 설정
  //    */
  //   @boundMethod
  //   public setOuterServiceStore(outerServiceStore: OuterServiceStoreBase): void {
  //     this.outerServiceStore = outerServiceStore;
  //   }

  //   /**
  //    * 스튜디오 컴포넌트 정보 관리자 반환
  //    */
  //   @boundMethod
  //   public getHighLevelStudiosContainer(): HighLevelStudiosContainer {
  //     return this.highLevelStudiosContainer;
  //   }

  //   /**
  //    * DataStore를 반환합니다
  //    */
  //   @boundMethod
  //   public getDataStore(): DataStoreBase {
  //     return this.dataStore;
  //   }

  //   /**
  //    * DataStore를 설정합니다
  //    */
  //   @boundMethod
  //   public setDataStore(dataStore: DataStoreBase): void {
  //     this.dataStore = dataStore;
  //   }

  //   /**
  //    * Custom Function 매핑 관리자 반환
  //    */
  //   @boundMethod
  //   public getCustomFunctionStore(): CustomFunctionStoreBase {
  //     return this.customFunctionStore;
  //   }

  //   /**
  //    * Custom Function 매핑 관리자 설정
  //    */
  //   @boundMethod
  //   public setCustomFunctionStore(customFunctionStore: CustomFunctionStoreBase) {
  //     this.customFunctionStore = customFunctionStore;
  //   }

  //   /**
  //    * 서비스 매핑 관리자 반환
  //    */
  //   @boundMethod
  //   public getServiceStore(): ServiceStoreBase {
  //     return this.serviceStore;
  //   }

  //   /**
  //    * 서비스 매핑 관리자 설정
  //    */
  //   @boundMethod
  //   public setServiceStore(serviceStore: ServiceStoreBase): void {
  //     this.serviceStore = serviceStore;
  //   }

  //   /**
  //    * ServiceHandlerStore를 반환합니다
  //    */
  //   @boundMethod
  //   public getServiceHandlerStore(): ServiceHandlerStoreBase {
  //     return this.serviceHandlerStore;
  //   }

  //   /**
  //    * ServiceHandlerStore를 설정합니다
  //    */
  //   @boundMethod
  //   public setServiceHandlerStore(serviceHandlerStore: ServiceHandlerStoreBase): void {
  //     this.serviceHandlerStore = serviceHandlerStore;
  //   }

  //   /**
  //    * DataBindingContainer를 반환합니다
  //    */
  //   @boundMethod
  //   public getDataBindingContainer(): DataBindingContainer {
  //     return this.dataBindingContainer;
  //   }

  //   /**
  //    * DataBindingContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setDataBindingContainer(dataBindingContainer: DataBindingContainer): void {
  //     this.dataBindingContainer = dataBindingContainer;
  //   }

  //   /**
  //    * UiStore를 반환합니다
  //    */
  //   @boundMethod
  //   public getUiStore(): UIStore {
  //     return this.uiStore;
  //   }

  //   /**
  //    * UiStore를 설정합니다
  //    */
  //   @boundMethod
  //   public setUiStore(uiStore: UIStore): void {
  //     this.uiStore = uiStore;
  //   }

  //   /**
  //    * BusinessComponentServiceMapper를 반환합니다
  //    */
  //   @boundMethod
  //   public getBusinessComponentServiceMapper(): BusinessComponentServiceMapper {
  //     return this.businessComponentServiceMapper;
  //   }

  //   /**
  //    * BusinessComponentServiceMapper를 설정합니다
  //    */
  //   @boundMethod
  //   public setBusinessComponentServiceMapper(businessComponentServiceMapper: BusinessComponentServiceMapper): void {
  //     this.businessComponentServiceMapper = businessComponentServiceMapper;
  //   }

  /**
   * NavigateFunction를 반환합니다
   */
  @boundMethod
  public getNavigateFunction(): NavigateFunction | undefined {
    return this.navigateFunction;
  }

  /**
   * NavigateFunction를 설정합니다
   */
  @boundMethod
  public setNavigateFunction(navigateFunction: NavigateFunction): void {
    this.navigateFunction = navigateFunction;
  }

  /**
   * drawingToolContainer를 반환합니다
   */
  //   @boundMethod
  //   public getDrawingToolContainer(): DrawingToolContainer {
  //     return this.drawingToolContainer;
  //   }

  //   /**
  //    * drawingToolContainer를 설정합니다
  //    */
  //   @boundMethod
  //   public setDrawingToolContainer(drawingToolContainer: DrawingToolContainer): void {
  //     this.drawingToolContainer = drawingToolContainer;
  //   }
}

export default AppEditableContextBase;
