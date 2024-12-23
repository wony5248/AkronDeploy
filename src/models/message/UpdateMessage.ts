import { boundMethod } from 'autobind-decorator';
import { Nullable } from '@akron/runner';
import { WidgetID } from 'models/node/WidgetModel';

/**
 * 서버로 보낼 메시지 객체입니다.
 */
export default class UpdateMessage {
  private appID?: number;

  private modelID?: WidgetID;

  // behavior 값으로 서버에서 업데이트 동작을 구분합니다.
  // 기본적으로 prefix는 I(Insert), U(Update), D(Delete)로 구분됩니다.
  // ex. ua는 appInfo를 업데이트합니다.
  // Postfix로 DataStore의 경우, vd(ViewData), ad(vAriableData), wcs(WidgetCompisteState),
  // wcp(WidgetCompositeProperty)로 구분됩니다.
  private behavior: string | undefined;

  /**
   * constructor
   */
  public constructor(appID?: number, modelID?: WidgetID, behavior?: string) {
    this.appID = appID;
    this.modelID = modelID;
    this.behavior = behavior;
  }

  /**
   * AppID setter
   */
  @boundMethod
  public setAppID(appID?: number): void {
    this.appID = appID;
  }

  /**
   *  modelID setter
   */
  @boundMethod
  public setModelID(modelID: WidgetID): void {
    this.modelID = modelID;
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
  public getAppID(): Nullable<number> {
    return this.appID;
  }

  /**
   * modelID getter
   */
  @boundMethod
  public getModelID(): Nullable<WidgetID> {
    return this.modelID;
  }

  /**
   * behavior getter
   */
  @boundMethod
  public getBehavior(): Nullable<string> {
    return this.behavior;
  }
}
