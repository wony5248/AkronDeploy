import { createContext } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
/**
 * 툴팁 데이터 타입
 */
export type TooltipDataType = {
  title?: string;
  content?: string;
  icon?: string;
  link?: string;
  linkText?: string;
};
/**
 * 툴팁 데이터의 position 타입
 */
export type TooltipPositionType =
  | 'topCenter'
  | 'bottomCenter'
  | 'left'
  | 'right'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topRight'
  | 'topLeft';

/**
 * Tooltip 을 위한 Property들을 관리하는 Class입니다.
 */
class TooltipStore {
  @observable
  private tooltipData: TooltipDataType;

  @observable
  private isVisible: boolean;

  @observable
  private target?: Element;

  private position: TooltipPositionType;

  /**
   * 생성자
   */
  public constructor() {
    makeObservable(this);

    this.tooltipData = {
      title: '',
      content: '',
      icon: '',
      link: '',
      linkText: '',
    };
    this.target = undefined;
    this.isVisible = false;
    this.position = 'topCenter';
  }

  /**
   * tooltipData를 가져옵니다.
   */
  public getTooltip() {
    return this.tooltipData;
  }

  /**
   * tooltip이 연결될 target을 가져옵니다.
   */
  public getTarget() {
    return this.target;
  }

  /**
   * tooltip이 target 기준으로 생성될 위치를 가져옵니다.
   */
  public getPosition() {
    return this.position;
  }

  /**
   * tooltip의 시각화 여부를 가져옵니다.
   */
  @boundMethod
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * tooltip의 시각화 여부를 설정합니다.
   */
  @action.bound
  public setIsVisible(isVisible: boolean): void {
    this.isVisible = isVisible;
  }

  /**
   *  tooltip이 연결될 target을 설정합니다.
   */
  @action
  public setTarget(element: undefined | Element) {
    this.target = element;
  }

  /**
   * tooltip을 open합니다.
   * ```
   * import tooltipStore from 'common/store/tooltip/TooltipStore';
   *
   * <Component onMouseEnter={(e) => tooltipStore.openTooltip(e, 'topCenter', { title, content, icon, link, linkText })} />
   * ```
   * 형태로 사용합니다.
   */
  @action
  public openTooltip(
    e: React.MouseEvent,
    position: TooltipPositionType,
    { title, content, icon, link, linkText }: TooltipDataType
  ) {
    if (!e || (!title && !content && !icon && !link && !linkText)) return;

    this.tooltipData = { title, content, icon, link, linkText };
    this.position = position;
    this.setIsVisible(false);
    this.setTarget(e.currentTarget);
  }
}

export default TooltipStore;
