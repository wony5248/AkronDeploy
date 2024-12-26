import { boundMethod } from 'autobind-decorator';
import { action, makeObservable, observable } from 'mobx';
import { CustomProps, ICompositeModel, ICustomProp } from './CompositeComponentContainerTypes';
import { WidgetPropID } from 'models/widget/WidgetPropTypes';

/**
 * Component Wrapping을 위한 Model 입니다.
 */
export default class CompositeModel {
  /**
   * 컴포넌트 이름
   */
  @observable
  private name: string;

  /**
   * 사용자 정의 props
   */
  @observable
  private props: CustomProps;

  /**
   * 컴포넌트가 잠금 상태인지 확인할 수 있는 정보
   */
  @observable
  private locked: boolean;

  /**
   * 컴포넌트의 가시성을 확인할 수 있는 정보
   */
  @observable
  private hidden: boolean;

  /**
   * properties의 selected 속성.
   */
  @observable
  private selected: boolean;

  /**
   * 생성자
   */
  constructor(args: ICompositeModel) {
    makeObservable(this);
    this.name = args.name;
    this.props = args.props ?? new Map<WidgetPropID, ICustomProp>();
    this.locked = args.locked ?? false;
    this.hidden = args.hidden ?? false;
    this.selected = false;
  }

  /**
   * 컴포넌트 이름을 반환합니다.
   */
  public getName() {
    return this.name;
  }

  /**
   * 컴포넌트 이름을 변경합니다.
   */
  @action
  public setName(name: string) {
    this.name = name;
  }

  /**
   * 사용자 정의 Props를 반환합니다.
   */
  public getProps(): CustomProps {
    return this.props;
  }

  /**
   * 사용자 정의 Prop를 반환합니다.
   */
  public getProp(propId: WidgetPropID): ICustomProp | undefined {
    return this.props.get(propId);
  }

  /**
   * 단일 Prop을 Setting 합니다.
   */
  @action
  public setProps(propId: WidgetPropID, prop: ICustomProp) {
    this.props.set(propId, prop);
  }

  /**
   * 모든 Prop을 Setting 합니다.
   */
  @action
  public setAllProps(props: CustomProps) {
    this.props = props;
  }

  /**
   * 모든 Prop을 삭제합니다.
   */
  @action
  public clearProps() {
    this.props.clear();
  }

  /**
   * 컴포넌트 잠금 상태를 반환합니다.
   */
  public getLocked(): boolean {
    return this.locked;
  }

  /**
   * 컴포넌트 잠금 상태를 변경합니다.
   */
  @action
  public setLocked(locked: boolean) {
    this.locked = locked;
  }

  /**
   * 컴포넌트 가시 상태를 반환합니다.
   */
  public getHidden(): boolean {
    return this.hidden;
  }

  /**
   * 컴포넌트 가시 상태를 변경합니다.
   */
  @action
  public setHidden(hidden: boolean) {
    this.hidden = hidden;
  }

  /**
   * get selected.
   */
  @boundMethod
  public getSelected() {
    return this.selected;
  }

  /**
   * set selected.
   */
  @action
  public setSelected(selected: boolean) {
    this.selected = selected;
  }

  /**
   * CompositeModel의 Clone 함수 입니다.
   */
  public clone(): CompositeModel {
    const newCompositeModel = new CompositeModel({
      name: this.name,
      props: new Map(Array.from(this.props, ([key, value]) => [key, JSON.parse(JSON.stringify(value))])),
      locked: this.locked,
      hidden: this.hidden,
    });
    return newCompositeModel;
  }
}
