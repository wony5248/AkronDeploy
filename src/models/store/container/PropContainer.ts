import { boundMethod } from 'autobind-decorator';
import { makeObservable, observable } from 'mobx';
import SubToolpaneContainer from 'models/store/container/SubToolpaneContainer';
import WidgetPropContainer from 'models/store/container/WidgetPropContainer';

/**
 * UI 업데이트를 위한 Property들을 관리하는 Class입니다.
 */
class PropContainer {
  @observable
  private widgetPropContainer: WidgetPropContainer;

  // FIXME: app type에 따른 prop manager 분리
  @observable
  //   private compositePropContainer: CompositePropContainer;
  private subToolpaneContainer: SubToolpaneContainer;

  /**
   * 생성자
   */
  public constructor() {
    makeObservable(this);
    this.widgetPropContainer = new WidgetPropContainer();
    // this.compositePropContainer = new CompositePropContainer();
    this.subToolpaneContainer = new SubToolpaneContainer();
  }

  /**
   * 초기화 함수 입니다.
   */
  @boundMethod
  public clear(): void {
    this.widgetPropContainer = new WidgetPropContainer();
    // this.compositePropContainer = new CompositePropContainer();
  }

  /**
   * widgetPropContainer를 반환합니다.
   */
  @boundMethod
  public getWidgetPropContainer(): WidgetPropContainer {
    return this.widgetPropContainer;
  }

  /**
   * compositePropContainer를 반환합니다.
   */
  //   @boundMethod
  //   public getCompositePropContainer(): CompositePropContainer {
  //     return this.compositePropContainer;
  //   }

  /**
   * subToolpaneContainer를 반환합니다.
   */
  @boundMethod
  public getSubToolpaneContainer(): SubToolpaneContainer {
    return this.subToolpaneContainer;
  }
}

export default PropContainer;
