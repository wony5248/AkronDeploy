import { action, makeObservable, observable } from 'mobx';
import { WidgetID } from 'models/node/WidgetModel';
import { WidgetPropID } from 'models/widget/WidgetPropTypes';
import { CompositeModels, CustomProps, ICustomProp } from 'store/component/CompositeComponentContainerTypes';
import CompositeModel from 'store/component/CompositeModel';

/**
 * 컴포넌트화된 Composite 컴포넌트 정보를 저장합니다.
 */
export default class CompositeComponentContainer {
  /**
   * Composite 컴포넌트 모델
   */
  @observable
  private compositeModels: CompositeModels;

  /**
   * 생성자
   */
  constructor() {
    makeObservable(this);
    this.compositeModels = new Map<WidgetID, CompositeModel>();
  }

  /**
   * Composite Model Map 반환
   */
  public getCompositeModels(): CompositeModels {
    return this.compositeModels;
  }

  /**
   * Composite Model Getter
   */
  public getCompositeModel(widgetId: WidgetID): CompositeModel | undefined {
    return this.compositeModels.get(widgetId);
  }

  /**
   * Composite Models Setter
   */
  @action
  public setCompositeModels(compositeModels: CompositeModels): void {
    this.compositeModels = compositeModels;
  }

  /**
   * Custom Props Getter
   */
  public getCustomProps(widgetId: WidgetID): CustomProps | undefined {
    return this.compositeModels.get(widgetId)?.getProps();
  }

  /**
   * Custom Prop Getter
   */
  public getCustomProp(widgetId: WidgetID, propId: WidgetPropID): ICustomProp | undefined {
    return this.compositeModels.get(widgetId)?.getProps()?.get(propId);
  }

  /**
   * 사용자 정의 Composite Model Map 초기화
   */
  @action
  public clearCompositeModels() {
    this.compositeModels.clear();
  }
}
