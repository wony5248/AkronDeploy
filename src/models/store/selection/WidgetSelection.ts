import { makeObservable } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';

/**
 * HTML Widget Component 의 selection 정보를 나타내기 위한 class
 */
export default class WidgetSelection {
  // 현재 Widget 의 WidgetModel.
  private widgetModel: WidgetModel;

  // 현재 Widget 의 parentWidgetModel.
  private parentModel: WidgetModel | undefined;

  /**
   * 생성자.
   *
   * @param widgetModel widgetModel.
   */
  public constructor(widgetModel: WidgetModel) {
    makeObservable(this);
    this.widgetModel = widgetModel;
    // this.parentModel = widgetModel.getParent();
  }

  //   /**
  //    * 현재 Selection이 나타내는 WidgetModel의 select 유무를 설정합니다.
  //    *
  //    * @param selected widget의 select 유무.
  //    */
  //   @action.bound
  //   public setSelected(selected: boolean): void {
  //     this.widgetModel.setProperties({
  //       ...this.widgetModel.getProperties(),
  //       selected,
  //     });
  //   }

  /**
   * widgetModel 반환.
   */
  public getWidgetModel(): WidgetModel {
    return this.widgetModel;
  }

  /**
   * parent Widget 을 반환
   */
  public getParentModel(): WidgetModel | undefined {
    return this.parentModel;
  }
}
