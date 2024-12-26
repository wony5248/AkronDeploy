import { boundMethod } from 'autobind-decorator';
import { observable, makeObservable } from 'mobx';
import { WidgetID } from 'models/node/WidgetModel';
import { ReadOnlyContextBaseProp } from 'models/store/context/ContextTypes';

/**
 * 현재 편집 중인 app의 정보 및 편집기의 상태들을 담고 있습니다.
 * AppStore는 command, event 등의 로직들을 현재의 AppContextBase 값 위에 정해진 순서대로 적용하는 형태로 작동합니다.
 * (CM/C (Component Manager / Component) 구조)
 */
class ReadOnlyContextBase {
  /**
   * 현재 문서 ID를 나타냅니다.
   */
  @observable
  private readonly appID: WidgetID;

  /**
   * 생성자
   */
  constructor(initProp: ReadOnlyContextBaseProp) {
    makeObservable(this);

    this.appID = initProp.appID;
  }

  /**
   * AppID를 반환합니다
   */
  @boundMethod
  public getAppID(): WidgetID {
    return this.appID;
  }
}

export default ReadOnlyContextBase;
