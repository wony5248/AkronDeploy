import {
  BaseWidgetModel,
  dError,
  IWidgetCommonProperties,
  Nullable,
  WidgetCategory,
  WidgetTypeEnum,
} from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { action, makeObservable } from 'mobx';
import { Behavior } from 'models/message/OperationMessage';
import { IOperationMessage } from 'models/message/OperationMessageType';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';
import IdContainerController from 'models/store/container/IdContainerController';
import { makeInstanceMessageRecursive, makeRelationMessageRecursive } from 'util/WidgetMessageUtil';
import { getPropertyKeys } from 'util/WidgetUtil';

export type WidgetID = number;

export type WidgetTypeID = number;

export interface IWidgetModelInitProps<IWidgetCommonProperties> {
  id: WidgetID;
  widgetType: WidgetTypeEnum;
  widgetCategory: WidgetCategory;
  name: string;
  properties: IWidgetCommonProperties;
  ref?: React.RefObject<HTMLElement> | undefined;
}

class WidgetModel<
  Properties extends IWidgetCommonProperties = IWidgetCommonProperties,
> extends BaseWidgetModel<Properties> {
  /**
   * 생성자
   */
  constructor(args: IWidgetModelInitProps<Properties>) {
    super({
      id: args.id,
      widgetType: args.widgetType,
      widgetCategory: args.widgetCategory,
      name: args.name,
      properties: args.properties,
      ref: args.ref,
    });

    makeObservable(this);
  }

  public isRepeatableLayoutWidgetType() {
    return false;
  }

  /**
   * 주어진 노드로부터 시작하여 자식들을 탐색합니다.
   * 만일 stopIf(노드) = true인 노드를 만날 경우 거기서 멈춥니다.
   * 그 외의 경우 모든 자식을 탐색합니다.
   * 모든 노드 나열, 또는 특정 조건 만족시키는 노드 탐색 등 여러 용도로 사용이 가능합니다.
   *
   * @param stopIf 탐색 중지 조건
   * @returns { visitedNodes: 방문한 노드 목록, stoppedAt?: 중간에 멈춘 경우 멈춘 노드 }
   */
  public traverseAllChilds(stopIf: (node: WidgetModel) => boolean = () => false): {
    visitedNodes: WidgetModel[];
    stoppedAt?: WidgetModel;
  } {
    // 스택 기반 DFS.
    // -- 담에 방문할 노드들 넣음. / 방문 시 다시 꺼냄.
    const searchStack: WidgetModel[] = [this];
    // -- 방문한 노드들 목록. 중복 방지 및 목록 정리용.
    const visitMap: Map<number, WidgetModel> = new Map();

    while (searchStack.length > 0) {
      const node = searchStack.pop()!;

      if (visitMap.has(node.getID())) {
        // continue 쓰고 싶어서.. ㅠ

        continue;
      }

      visitMap.set(node.getID(), node);

      if (stopIf(node)) {
        return {
          visitedNodes: Array.from(visitMap.values()),
          stoppedAt: node,
        };
      }

      node.forEachChild(child => {
        if (visitMap.has(child.getID())) {
          return;
        }

        searchStack.push(child);
      });
    }

    return {
      visitedNodes: Array.from(visitMap.values()),
    };
  }

  /**
   * 해당 node 의 ID 를 리턴합니다.
   * @returns 해당 node 의 ID
   */
  @boundMethod
  public getID(): number {
    return super.getID();
  }

  public getWidgetCategory(): WidgetCategory {
    return this.widgetCategory;
  }

  /**
   * Widget의 속성들을 반환합니다.
   */
  public getProperties(): Properties {
    return this.properties;
  }

  /**
   * Widget의 속성들을 셋팅합니다.
   *
   * @param 변경할 properties.
   */
  @action
  public setProperties(properties: Properties) {
    this.properties = properties;
  }

  /**
   * Widget의 style 속성을 반환합니다.
   * Length 타입과 같이 depth가 한 번 더 있는 경우,
   * 해당 값들을 나머지 변수로 가져오기 위함입니다.
   */
  public getStyleProperties(propCategory: string) {
    const widgetStyle = this.properties.style;
    // switch (propCategory) {
    //   case 'x': {
    //     return widgetStyle.x.value ?? widgetStyle.x.defaultValue;
    //   }
    //   case 'y': {
    //     return widgetStyle.y.value ?? widgetStyle.y.defaultValue;
    //   }
    //   case 'width': {
    //     return widgetStyle.width.value ?? widgetStyle.width.defaultValue;
    //   }
    //   case 'height': {
    //     return widgetStyle.height.value ?? widgetStyle.height.defaultValue;
    //   }
    //   case 'maxWidth': {
    //     return widgetStyle.maxWidth.value ?? widgetStyle.maxWidth.defaultValue;
    //   }
    //   case 'maxHeight': {
    //     return widgetStyle.maxHeight.value ?? widgetStyle.maxHeight.defaultValue;
    //   }
    //   case 'minWidth': {
    //     return widgetStyle.minWidth.value ?? widgetStyle.minWidth.defaultValue;
    //   }
    //   case 'minHeight': {
    //     return widgetStyle.minHeight.value ?? widgetStyle.minHeight.defaultValue;
    //   }
    //   default: {
    //     dError('Property is not exist.');
    //     return null;
    //   }
    // }
    if (widgetStyle[propCategory]) {
      return widgetStyle[propCategory].value ?? widgetStyle[propCategory].defaultValue;
    }
    dError('Property is not exist.');
    return null;
  }

  /**
   * sibling 사이에서 나의 index값 반환.
   * parent가 없거나 child가 아닌 경우 -1 반환.
   */
  public getSiblingIndex(): number {
    const parent = this.getParent();
    if (!parent) {
      return -1;
    }
    let child = parent.getFirstChild();
    for (let i = 0; i < parent.getChildCount(); ++i) {
      if (child === this) {
        return i;
      }
      child = child?.getNextSibling();
    }
    return -1;
  }

  /**
   * set ref.
   */
  public setRef(ref: React.RefObject<Element> | undefined) {
    console.log(ref);
    this.ref = ref;
    this.triggerRerender();
  }

  /**
   * get computed style.
   * 사용자가 지정한 스타일이 **아니라** 계산 결과값을 반환합니다.
   * 성능적으로 빡세야 하는 곳에는 사용을 지양하세요.
   */
  public getRefStyle() {
    return super.getRefStyle();
  }

  /**
   * get DOM X.
   * screen 기준 값이므로 사용처에서 Page 기준으로 converting 필요.
   */
  public getRefX(): number | undefined {
    return super.getRefX();
  }

  /**
   * get DOM Y.
   * screen 기준 값이므로 사용처에서 Page 기준으로 converting 필요.
   */
  public getRefY(): number | undefined {
    return super.getRefY();
  }

  /**
   * get DOM width.
   */
  public getRefWidth(): number | undefined {
    return super.getRefWidth();
  }

  /**
   * get DOM height.
   */
  public getRefHeight(): number | undefined {
    return super.getRefHeight();
  }

  /**
   * Widget의 이름을 반환합니다.
   */
  public getName() {
    return this.name;
  }

  /**
   * Widget의 이름을 변경합니다.
   */
  @action
  public setName(name: string) {
    this.name = name;
  }

  /**
   * Widget의 종류를 반환합니다.
   * VERSION2_DELETE: 해당 함수 WidgetModel에 정의되어있어 작성은 했으나,
   * 저장 로직 변경시 제거 필요합니다.
   */
  public getWidgetType() {
    return this.widgetType;
  }

  /**
   * child 수를 반환하는 함수
   */
  public getChildCount(): number {
    const childCount = this.reduceChild((curCount: number) => {
      return curCount + 1;
    }, 0);
    return childCount;
  }

  /**
   * 현재 node의 parent node를 반환합니다.
   */
  public getParent() {
    return super.getParent() as Nullable<WidgetModel>;
  }

  /**
   * 현재 node의 parent node를 세팅합니다.
   */
  public setParent(parent: Nullable<WidgetModel>) {
    super.setParent(parent);
  }

  /**
   * 첫번째 child model을 반환.
   */
  public getFirstChild() {
    return super.getFirstChild() as Nullable<WidgetModel>;
  }

  /**
   * 마지막 child model을 반환.
   */
  public getLastChild() {
    return super.getLastChild() as Nullable<WidgetModel>;
  }

  /**
   * 이전의 형제 node를 반환.
   */
  public getPrevSibling() {
    return super.getPrevSibling() as Nullable<WidgetModel>;
  }

  /**
   * 다음의 형제 node를 반환.
   */
  public getNextSibling() {
    return super.getNextSibling() as Nullable<WidgetModel>;
  }

  /**
   * 첫번째 child model을 세팅.
   */
  public setFirstChild(firstChild: Nullable<WidgetModel>) {
    super.setFirstChild(firstChild);
  }

  /**
   * 마지막 child model을 세팅.
   */
  public setLastChild(lastChild: Nullable<WidgetModel>) {
    super.setLastChild(lastChild);
  }

  /**
   * Parent에 이 node를 child로 추가.
   * 특정 위치에 이 node를 붙이고 싶으면 next를 사용하세요.
   */
  public append(parent: WidgetModel, next?: WidgetModel) {
    super.append(parent, next);
  }

  /**
   * 이 node를 parent에서 제거.
   */
  public remove(parent: WidgetModel) {
    super.remove(parent);
  }

  /**
   * 각 child에 대하여 함수(`fn`)를 실행.
   * index를 사용하는 함수가 client 프로젝트에 남아있어 임시로 제공하는 함수입니다.
   *
   * @deprecated
   * @example
   * this.forEachChildWithIndex((child, index) => {
   *     console.log(child.getID(), index);
   * });
   */
  @boundMethod
  public forEachChildWithIndex(fn: (child: WidgetModel, index: number) => void) {
    super.forEachChildWithIndex(fn as (child: BaseWidgetModel, index: number) => void);
  }

  /**
   * 각 child에 대하여 함수(`fn`)를 실행.
   *
   * @example
   * this.forEachChild(child => {
   *     console.log(child.getID());
   * });
   */
  @boundMethod
  public forEachChild(fn: (child: WidgetModel) => void) {
    super.forEachChild(fn as (child: BaseWidgetModel) => void);
  }

  /**
   * 각 child에 대하여 함수(`fn`)를 실행하여 결과의 모음을 array로 반환.
   *
   * @example
   * const idList = this.mapChild(child => {
   *     return child.getID();
   * });
   */
  @boundMethod
  public mapChild<T>(fn: (child: WidgetModel) => T): T[] {
    return super.mapChild(fn as (child: BaseWidgetModel) => T);
  }

  /**
   * 각 child에 대하여 함수(`fn`)를 실행하여 결과를 누적.
   * ex. 3번째 child에 fn()을 수행한 결과가 4번째 child의 fn의 accumulator로 들어감.
   *
   * @example
   * const idSum = this.reduceChild((currentSum, child) => {
   *     return currentSum + child.getID();
   * });
   */
  public reduceChild<T>(fn: (accumulator: T, child: WidgetModel) => T, initialValue: T): T {
    return super.reduceChild(fn as (accumulator: T, child: BaseWidgetModel) => T, initialValue);
  }

  public getContentType(): ContentType {
    return ContentType.COMPONENT;
  }

  /**
   * WidgetModel를 상속받는 Model들의 Clone 함수 입니다.
   * 하위의 모델들을 클론하지 않습니다
   *  ( 자기 자신 하나만 클론이 필요할 때 구현합니다 )
   */
  public clone(idContainerController: IdContainerController): WidgetModel {
    const newWidgetId = idContainerController.generateComponentId();
    const cloneModel = new WidgetModel({
      id: newWidgetId,
      widgetType: this.getWidgetType(),
      widgetCategory: this.getWidgetCategory(),
      name: this.getName(),
      properties: this.getProperties(),
    });

    return cloneModel as WidgetModel;
  }

  /**
   * Node를 통째로 복사합니다.
   * 단, clone과 그 child들의 ID는 복사되지 않고 새롭게 생성됩니다.
   */
  public cloneNode(idContainerController: IdContainerController) {
    const newNode = this.clone(idContainerController) as WidgetModel;
    this.cloneSubTree(idContainerController, newNode);

    return newNode;
  }

  /**
   * 하위에 존재하는 node를 순회하며 클론합니다.
   */
  @boundMethod
  protected cloneSubTree(idContainerController: IdContainerController, newNode: WidgetModel): void {
    this.forEachChild(child => {
      if (!(child instanceof WidgetModel)) {
        return;
      }
      const newChild = child.cloneNode(idContainerController);
      if (newChild) {
        newChild.append(newNode);
      }
    });
  }

  /**
   * 컴포넌트 삽입, relation update시 사용되는 Message 생성 api
   */
  @boundMethod
  public makeOperationMessage(behavior: Behavior): Nullable<IOperationMessage[]> {
    if (behavior === 'ie') {
      const relationMessage = this.makeRelationMessages(behavior);
      const instanceMessage = this.makeInstanceMessages(behavior);
      const contentMessage = this.makeContentMessage();
      const styleMessage = this.makeStyleMessage();
      return [...relationMessage, ...instanceMessage, ...contentMessage, ...styleMessage];
    }
    const relationMessage = this.makeRelationMessage(behavior);
    return [relationMessage];
  }

  /**
   * Model 하위가 전체 바뀌는 경우를 위한 재귀 Relation Message 생성
   */
  @boundMethod
  public makeRelationMessages(behavior: Behavior): IOperationMessage[] {
    const messages = new Array<IOperationMessage>();
    messages.push(...makeRelationMessageRecursive(this, behavior));
    return messages;
  }

  /**
   * Model 1개의 변경에서 사용되는 Relation Message 생성
   */
  @boundMethod
  public makeRelationMessage(behavior: Behavior): IOperationMessage {
    return {
      elementId: this.getID(),
      elementType: this.getContentType(),
      parentId: this.getParent()?.getID(),
      nextId: this.getNextSibling()?.getID(),
      childId: this.getFirstChild()?.getID(),
      behavior: behavior,
    };
  }

  /**
   * Model 하위가 전체 Instance 변경시 사용되는 Message 생성
   */
  @boundMethod
  public makeInstanceMessages(behavior: Behavior): IOperationMessage[] {
    const messages = new Array<IOperationMessage>();
    messages.push(...makeInstanceMessageRecursive(this, behavior));
    return messages;
  }

  /**
   * Model 1개의 Instance 변경에서 사용되는 Message 생성
   */
  @boundMethod
  public makeInstanceMessage(behavior: Behavior): IOperationMessage {
    return {
      elementId: this.getID(),
      elementType: ContentType.COMPONENT,
      componentType: this.getWidgetType(),
      name: this.getName(),
      locked: false, // 필드 추가해야함
      hidden: false, // 필드 추가해야함
      behavior: behavior,
    };
  }

  /**
   * 컴포넌트 삽입시, Content Property Message를 생성합니다.
   */
  private makeContentMessage(): IOperationMessage[] {
    const contentKeys = getPropertyKeys(this.getProperties().style);
    const messageList: IOperationMessage[] = [];

    contentKeys.map(contentKey => {
      return {
        elementId: this.getID(),
        elementType: ContentType.COMPONENT_CONTENT,
        objectType: 1,
        behavior: 'ie',
        key: contentKey,
        value: this.getProperties().style[contentKey].value,
      } as IOperationMessage;
    });

    return messageList;
  }

  /**
   * 컴포넌트 삽입시, Style Property Message를 생성합니다.
   */
  private makeStyleMessage(): IOperationMessage[] {
    const styleKeys = getPropertyKeys(this.getProperties().style);
    const messageList: IOperationMessage[] = [];

    styleKeys.map(styleKey => {
      return {
        elementId: this.getID(),
        elementType: ContentType.COMPONENT_STYLE,
        objectType: 1,
        behavior: 'ie',
        key: styleKey,
        value: this.getProperties().style[styleKey].value,
      } as IOperationMessage;
    });

    return messageList;
  }
}

export default WidgetModel;
