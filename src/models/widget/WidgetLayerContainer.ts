import { action, makeObservable, observable } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { WidgetLayerCommandProps } from 'models/store/command/handler/WidgetLayerCommandHandler';
import EditorStore from 'models/store/EditorStore';
import { createContext } from 'react';
import { checkPageModel } from 'util/WidgetUtil';

/**
 * Widget Layer 이동시 필요한 정보를 관리하는 Container 입니다.
 */
class WidgetLayerContainer {
  /**
   * targetModel 하위 컴포넌트 ID 모음
   */
  @observable
  private usedComponentIDs: Set<number>;

  /**
   * 이동할 WidgetModel
   */
  @observable
  private targetModel: WidgetModel | undefined;

  /**
   * 이동할 WidgetModel의 부모
   */
  @observable
  private depModel: WidgetModel | undefined;

  /**
   * 이동할 WidgetModel의 목적지 부모
   */
  @observable
  private destModel: WidgetModel | undefined;

  /**
   * 이동할 WidgetModel의 목적지 다음 WidgetModel
   */
  @observable
  private destNextModel: WidgetModel | undefined;

  /**
   * 생성자.
   */
  constructor() {
    makeObservable(this);
    this.usedComponentIDs = new Set<number>();
  }

  /**
   * TargetModel setter
   */
  @action
  public setTargetModel(widgetModel: WidgetModel | undefined) {
    this.targetModel = widgetModel;
    if (widgetModel !== undefined) {
      this.usedComponentIDs.clear();
      this.findUsedComponentIDs(widgetModel);
    }
  }

  /**
   * DepModel setter
   */
  @action
  public setDepModel(widgetModel: WidgetModel | undefined) {
    this.depModel = widgetModel;
  }

  /**
   * DestModel setter
   */
  @action
  public setDestModel(widgetModel: WidgetModel | undefined) {
    this.destModel = widgetModel;
  }

  /**
   * DestNextModel setter
   */
  @action
  public setDestNextModel(widgetModel: WidgetModel | undefined) {
    this.destNextModel = widgetModel;
  }

  /**
   * 설정된 컨테이너를 전부 undefined로 설정합니다.
   */
  @action
  public clear() {
    this.targetModel = undefined;
    this.depModel = undefined;
    this.destModel = undefined;
    this.destNextModel = undefined;
  }

  /**
   * TargetModel getter
   */
  public getTargetModel() {
    return this.targetModel;
  }

  /**
   * DepModel getter
   */
  public getDepModel() {
    return this.depModel;
  }

  /**
   * DestModel getter
   */
  public getDestModel() {
    return this.destModel;
  }

  /**
   * DestNextModel getter
   */
  public getDestNextModel() {
    return this.destNextModel;
  }

  /**
   * targetModel 하위의 컴포넌트 목록을 Set형으로 반환합니다.
   */
  public getUsedComponentIDs() {
    return this.usedComponentIDs;
  }

  /**
   * targetModel이 설정되었는지에 따라 Drag 상태를 판별해 boolean으로 반환합니다.
   */
  public getIsDragging() {
    return this.targetModel !== undefined;
  }

  /**
   * grabbing 상태의 컴포넌트가 widgetModel에게, widgetModel의 부모에게, 페이지에 단독으로 들어갈 수 있는 컴포넌트인지 판별합니다.
   */
  public isInsertableModel(widgetModel: WidgetModel) {
    const parentModel = widgetModel.getParent() as WidgetModel;

    if (
      !this.targetModel ||
      this.targetModel === parentModel ||
      this.usedComponentIDs.has(widgetModel.getID()) ||
      parentModel.isRepeatableLayoutWidgetType()
    ) {
      return false;
    }

    return checkPageModel(parentModel);
  }

  /**
   * 현재 WidgetLayerContainer에 저장된 model들이 레이어 이동이 가능한 상황인지를 판단합니다.
   */
  public isInsertableSituation(isInsertable: boolean) {
    if (
      this.targetModel &&
      this.depModel &&
      this.destModel &&
      this.destModel !== this.targetModel &&
      this.destNextModel !== this.targetModel &&
      isInsertable &&
      checkPageModel(this.destModel)
    ) {
      return true;
    }
    return false;
  }

  /**
   * 위젯 레이어 이동 커맨드를 동작합니다.
   */
  public execute(editorStore: EditorStore) {
    if (!this.targetModel || !this.depModel || !this.destModel) {
      return;
    }
    const commandProps: WidgetLayerCommandProps = {
      commandID: CommandEnum.LAYER_MOVE,
      targetModel: this.targetModel,
      depParentModel: this.depModel,
      destParentModel: this.destModel,
      destNextSiblingModel: this.destNextModel,
    };
    editorStore.handleCommandEvent(commandProps);
  }

  /**
   * targetModel 하위의 컴포넌트를 재귀적으로 찾습니다.
   */
  @action
  private findUsedComponentIDs(targetModel: WidgetModel) {
    if (targetModel === undefined) {
      return;
    }

    const componentID = targetModel.getID();

    if (componentID) {
      this.usedComponentIDs.add(componentID);
    }

    targetModel.forEachChild(childModel => {
      this.findUsedComponentIDs(childModel);
    });
  }
}

export const WidgetLayerContainerContext = createContext<WidgetLayerContainer>({} as WidgetLayerContainer);

/**
 * ContainerContext의 provider component.
 */
export const WidgetLayerContainerProvider = WidgetLayerContainerContext.Provider;

export default WidgetLayerContainer;
