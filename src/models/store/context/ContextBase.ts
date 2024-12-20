/**
 * 현재 편집 중인 app의 정보 및 편집기의 상태들을 담고 있습니다.
 * AppStore는 command, event 등의 로직들을 현재의 AppContextBase 값 위에 정해진 순서대로 적용하는 형태로 작동합니다.
 * (CM/C (Component Manager / Component) 구조)
 */
interface AppContextBase {
  /**
   * 현재 App의 widget model입니다.
   */
  //   appWidgetModel: WidgetModel<IComponentCommonProperties, IAppWidgetProperties>;

  /**
   * 현재 문서 ID를 나타냅니다.
   */
  appID: number;

  /**
   * App 의 Info
   */
  //   appInfo: AppInfo;

  /**
   * Widget 생성에 필요한 정보들을 담고 있습니다.
   */
  //   metaDataContainer: MetaDataContainer;

  /**
   * 앱에서 쓰이는 스타일들에 대한 정보들을 담고 있습니다.
   */
  //   appStylesContainer: AppStylesContainer;

  /**
   * 조합 컴포넌트 문서 ID를 나타냅니다.
   */
  //   templateID?: number;

  /**
   * Business Component에 대한 정보를 담는 Container
   */
  //   businessContainer: BusinessContainerBase;

  /**
   * Global 변수(data)를 갖고 있는 data store입니다.
   */
  //   dataStore: DataStoreBase;

  /**
   * 각종 data binding 정보를 담는 Container
   */
  //   dataBindingContainer: DataBindingContainer;

  /**
   * App내 UI로 표현되어야하는 Store
   */
  //   uiStore: UIStore;

  /**
   * 사용자가 제작한 BusinessDialog 들의 목록(ordered map)입니다.
   */
  //   registeredBusinessDialogWidgetMap: Map<
  //     WidgetID,
  //     WidgetModel<IComponentCommonProperties, IBusinessDialogWidgetProperties>
  //   >;

  /**
   * 비즈니스 다이얼로그 문서 ID를 나타냅니다.
   */
  //   businessDialogID?: number;

  /**
   * 외부 서비스 스토어
   */
  //   externalServiceStore: ExternalServiceStore;

  /**
   * DX 서비스 스토어
   */
  //   dxServiceStore?: DxServiceStore;

  //   businessComponentServiceMapper: BusinessComponentServiceMapper;

  // OSobjectContainer
  //   OSobjectContainer: OSobjectContainer;

  //   navigateFunction?: NavigateFunction;
}

export default AppContextBase;
