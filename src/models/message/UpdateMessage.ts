import { boundMethod } from 'autobind-decorator';

/**
 * 서버로 보낼 메시지 객체입니다.
 */
export default class UpdateMessage<ID> {
  private appID?: ID;

  private modelID?: ID;

  // behavior 값으로 서버에서 업데이트 동작을 구분합니다.
  // 기본적으로 prefix는 I(Insert), U(Update), D(Delete)로 구분됩니다.
  // ex. ua는 appInfo를 업데이트합니다.
  // Postfix로 DataStore의 경우, vd(ViewData), ad(vAriableData), wcs(WidgetCompisteState),
  // wcp(WidgetCompositeProperty)로 구분됩니다.
  private behavior: string | undefined;

  /**
   * constructor
   */
  public constructor(appID?: ID, modelID?: ID, behavior?: string) {
    this.appID = appID;
    this.modelID = modelID;
    this.behavior = behavior;
  }

  /**
   * AppID setter
   */
  @boundMethod
  public setAppID(id?: ID): void {
    this.appID = id;
  }

  /**
   *  modelID setter
   */
  @boundMethod
  public setModelID(id: ID): void {
    this.modelID = id;
  }

  /**
   * behavior setter (ie ui de)
   */
  @boundMethod
  public setBehavior(behavior?: string): void {
    this.behavior = behavior;
  }

  /**
   * Getter of appID
   */
  @boundMethod
  public getAppID(): ID | undefined {
    return this.appID;
  }

  /**
   * modelID getter
   */
  @boundMethod
  public getModelID(): ID | undefined {
    return this.modelID;
  }

  /**
   * behavior getter
   */
  @boundMethod
  public getBehavior(): string | undefined {
    return this.behavior;
  }
}
